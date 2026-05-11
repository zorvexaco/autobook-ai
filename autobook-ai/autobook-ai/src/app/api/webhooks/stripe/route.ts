import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { handleWebhookEvent } from '@/lib/stripe/webhooks';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await handleWebhookEvent(event);

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
