// src/app/api/stripe/checkout-pass/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PASS_PRICE_ID!, quantity: 1 }],
    customer_email: session.user.email!,
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: { userId: (session.user as any).id, plan: "PREMIUM" },
  });

  return NextResponse.redirect(checkout.url!);
}
