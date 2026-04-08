"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function PurchaseTracker() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "unknown";
  const sessionId = searchParams.get("session_id") || "";

  useEffect(() => {
    // Avoid double-firing on Strict Mode remounts
    const key = `purchase_tracked_${sessionId}`;
    if (sessionStorage.getItem(key)) return;

    if (typeof window !== "undefined" && (window as any).gtag) {
      // Rough value estimates by plan (actual amounts are in Stripe)
      const valueByPlan: Record<string, number> = {
        pass: 9.99,
        premium_monthly: 7,
        premium_annual: 39,
      };
      (window as any).gtag("event", "purchase", {
        transaction_id: sessionId || `sess_${Date.now()}`,
        value: valueByPlan[plan] || 0,
        currency: "USD",
        items: [{ item_id: plan, item_name: plan, quantity: 1 }],
      });
      sessionStorage.setItem(key, "1");
    }
  }, [plan, sessionId]);

  return null;
}
