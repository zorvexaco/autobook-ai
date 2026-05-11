export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  highlighted: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 4900,
    priceYearly: 47000,
    description: "Everything you need to automate bookings for a single location.",
    features: [
      "1 business location",
      "Missed-call text-back",
      "AI auto-replies",
      "Online booking widget",
      "Email support",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 9900,
    priceYearly: 95000,
    description: "Advanced automation and analytics for growing businesses.",
    features: [
      "Up to 5 business locations",
      "Everything in Starter",
      "Review request campaigns",
      "Custom reply templates",
      "Analytics dashboard",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 19900,
    priceYearly: 191000,
    description: "Full-scale solution for multi-location operations.",
    features: [
      "Unlimited locations",
      "Everything in Pro",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "SLA guarantee",
      "White-label options",
    ],
    highlighted: false,
  },
];

/**
 * Retrieve the Stripe price ID for a given plan and billing interval.
 * Price IDs are stored in environment variables to keep them out of
 * source code and allow per-environment configuration.
 *
 * Env var naming convention:
 *   STRIPE_PRICE_STARTER_MONTHLY, STRIPE_PRICE_STARTER_YEARLY
 *   STRIPE_PRICE_PRO_MONTHLY,     STRIPE_PRICE_PRO_YEARLY
 *   STRIPE_PRICE_ENTERPRISE_MONTHLY, STRIPE_PRICE_ENTERPRISE_YEARLY
 */
export function getStripePriceId(
  planId: string,
  interval: "monthly" | "yearly" = "monthly"
): string {
  const key = `STRIPE_PRICE_${planId.toUpperCase()}_${interval.toUpperCase()}`;
  const priceId = process.env[key];

  if (!priceId) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return priceId;
}
