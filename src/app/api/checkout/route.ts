import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { priceId, plan } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Price ID required" }, { status: 400 });
    }

    const isSubscription = plan === "premium_monthly" || plan === "premium_annual";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
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
