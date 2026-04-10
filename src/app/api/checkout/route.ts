import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Server-side price ID lookup — no NEXT_PUBLIC_ env vars needed on client
const PLAN_PRICE_MAP: Record<string, string | undefined> = {
  pass: process.env.STRIPE_PASS_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PASS_PRICE_ID,
  premium_monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
  premium_annual: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID,
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { plan, priceId: clientPriceId } = await req.json();

    // Use server-side lookup first, fall back to client-provided priceId
    const priceId = PLAN_PRICE_MAP[plan] || clientPriceId;

    if (!priceId) {
      return NextResponse.json(
        { error: "No price ID found for plan: " + plan + ". Check STRIPE_*_PRICE_ID env vars on Vercel." },
        { status: 400 }
      );
    }

    const isSubscription = plan === "premium_monthly";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.NEXTAUTH_URL + "/success?session_id={CHECKOUT_SESSION_ID}&plan=" + plan,
      cancel_url: process.env.NEXTAUTH_URL + "/pricing",
      customer_email: session?.user?.email || undefined,
      metadata: {
        userId: (session?.user as any)?.id || "",
        plan,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
