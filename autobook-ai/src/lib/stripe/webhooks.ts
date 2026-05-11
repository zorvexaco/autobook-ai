import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

type SubscriptionStatus =
  | "active"
  | "past_due"
  | "cancelled"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused";

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "cancelled";
    case "trialing":
      return "trialing";
    case "incomplete":
      return "incomplete";
    case "incomplete_expired":
      return "incomplete_expired";
    case "unpaid":
      return "unpaid";
    case "paused":
      return "paused";
    default:
      return "incomplete";
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const businessId = session.metadata?.business_id;
  const planId = session.metadata?.plan_id;

  if (!businessId) {
    console.error("Webhook: checkout.session.completed missing business_id in metadata");
    return;
  }

  const { error: subError } = await supabaseAdmin.from("subscriptions").upsert(
    {
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: customerId,
      business_id: businessId,
      plan_id: planId ?? null,
      status: "active",
      current_period_start: session.created
        ? new Date(session.created * 1000).toISOString()
        : new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );

  if (subError) {
    console.error("Webhook: failed to upsert subscription", subError);
    return;
  }

  const { error: bizError } = await supabaseAdmin
    .from("businesses")
    .update({ subscription_plan: planId ?? "starter", subscription_status: "active" })
    .eq("id", businessId);

  if (bizError) {
    console.error("Webhook: failed to update business plan", bizError);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const status = mapStripeStatus(subscription.status);

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      status,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Webhook: failed to update subscription status", error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "cancelled" as SubscriptionStatus,
      cancel_at_period_end: true,
    })
    .eq("stripe_subscription_id", subscription.id);

  if (error) {
    console.error("Webhook: failed to mark subscription cancelled", error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string | null;

  if (!subscriptionId) {
    return;
  }

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .update({ status: "past_due" as SubscriptionStatus })
    .eq("stripe_subscription_id", subscriptionId);

  if (error) {
    console.error("Webhook: failed to mark subscription past_due", error);
  }
}

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case "invoice.payment_failed":
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    default:
      // Unhandled event types are silently ignored
      break;
  }
}
