// src/lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    features: [
      "1 state access",
      "10 questions per test",
      "Basic explanations",
    ],
  },
  PASS: {
    name: "Pass",
    price: 4.99,
    priceId: process.env.STRIPE_PASS_PRICE_ID!,
    features: [
      "1 state full unlock",
      "Unlimited practice tests",
      "All test modes",
      "Full explanations",
      "One-time payment, no subscription",
    ],
  },
  PREMIUM_MONTHLY: {
    name: "Premium",
    price: 7,
    priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
    features: [
      "All 50 states",
      "Unlimited practice tests",
      "Full exam simulator",
      "Full explanations",
      "Progress tracking",
      "Multilingual translations",
      "Priority support",
    ],
  },
  PREMIUM_ANNUAL: {
    name: "Premium Annual",
    price: 39,
    priceId: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID!,
    features: [
      "All 50 states",
      "Unlimited practice tests",
      "Full exam simulator",
      "Full explanations",
      "Progress tracking",
      "Multilingual translations",
      "Priority support",
    ],
  },
};
