// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";


export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const subscription = event.data.object as Stripe.Subscription;

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = session.metadata?.userId;
      if (!userId) break;
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: sub.id,
          status: "ACTIVE",
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
        update: {
          stripeSubscriptionId: sub.id,
          status: "ACTIVE",
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      });
      await prisma.user.update({ where: { id: userId }, data: { plan: "PREMIUM" } });
      break;
    }

    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      if (inv.subscription) {
        const sub = await stripe.subscriptions.retrieve(inv.subscription as string);
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "ACTIVE", currentPeriodEnd: new Date(sub.current_period_end * 1000) },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: "CANCELED" },
      });
      // Downgrade user
      const sub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: subscription.id } });
      if (sub) await prisma.user.update({ where: { id: sub.userId }, data: { plan: "FREE" } });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
