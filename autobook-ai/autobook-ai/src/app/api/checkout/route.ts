import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { PLANS, getStripePriceId } from '@/lib/stripe/plans';

export async function POST(request: Request) {
  try {
    const { planId } = await request.json();
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    let priceId: string;
    try {
      priceId = getStripePriceId(planId, 'monthly');
    } catch {
      return NextResponse.json({ error: 'Plan pricing not configured' }, { status: 400 });
    }

    const { createServerClient } = await import('@supabase/ssr');
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: business } = await supabase
      .from('businesses')
      .select('id, stripe_customer_id, email')
      .eq('owner_id', user.id)
      .single();

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    let customerId = business.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || business.email,
        metadata: { business_id: business.id, user_id: user.id },
      });
      customerId = customer.id;
      await supabase.from('businesses').update({ stripe_customer_id: customerId }).eq('id', business.id);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/billing?success=true`,
      cancel_url: `${appUrl}/dashboard/billing?cancelled=true`,
      metadata: { business_id: business.id, plan_id: planId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
