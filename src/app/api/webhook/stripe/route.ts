import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Plan } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) break;

        await prisma.$executeRaw`
          UPDATE "User"
          SET plan = 'PREMIUM',
              "stripeCustomerId" = ${session.customer as string},
              "stripeSubscriptionId" = ${session.subscription as string || null}
          WHERE id = ${userId}
        `;
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.$executeRaw`
          UPDATE "User"
          SET plan = 'FREE',
              "stripeSubscriptionId" = null
          WHERE "stripeSubscriptionId" = ${sub.id}
        `;
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const plan: Plan = sub.status === "active" ? "PREMIUM" : "FREE";
        await prisma.$executeRaw`
          UPDATE "User"
          SET plan = ${plan}::"Plan"
          WHERE "stripeSubscriptionId" = ${sub.id}
        `;
        break;
      }
    }
  } catch (err: any) {
    console.error("Webhook handler error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
