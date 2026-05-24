"use client";

import PricingModal from "./PricingModal";
import { Badge, Sparkles } from "lucide-react";

export default function SubscriptionBadge({ tier }) {
  const isPro = tier === "pro";

  return (
    <PricingModal subscriptionTier={tier}>
      <Badge
        variant="outline"
        className={`flex h-8 px-4 gap-1.5 rounded-full text-xs font-semibold transition-all ${
          isPro
            ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white border-none shadow-sm"
            : "bg-stone-200/50 text-stone-600 border-stone-200"
        }`}
      >
        <Sparkles
          className={`h-3 w-3 ${
            isPro ? "text-white fill-white/20" : "text-stone-500"
          }`}
        />
        <span>{isPro ? "Pro Chef" : "Free Plan"}</span>
      </Badge>
    </PricingModal>
  );
}