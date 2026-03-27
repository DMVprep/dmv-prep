// src/app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { subscription: true },
  });

  // If already has Stripe customer, use billing portal
  if (user?.subscription?.stripeCustomerId) {
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    });
    return NextResponse.redirect(portal.url);
  }

  // Create new checkout session
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: PLANS.PREMIUM_MONTHLY.priceId, quantity: 1 }],
    customer_email: session.user.email!,
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: { userId: (session.user as any).id },
  });

  return NextResponse.redirect(checkout.url!);
}
