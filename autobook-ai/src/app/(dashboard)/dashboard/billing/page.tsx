'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PLANS } from '@/lib/stripe/plans';

export default function BillingPage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('businesses').select('*').eq('owner_id', user.id).single();
      setBusiness(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleCheckout = async (planId: string) => {
    setActionLoading(planId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
    }
    setActionLoading('');
  };

  const handlePortal = async () => {
    setActionLoading('portal');
    try {
      const res = await fetch('/api/billing-portal', { method: 'POST' });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Portal error:', err);
    }
    setActionLoading('');
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" /></div>;
  }

  const currentPlan = business?.subscription_plan || 'starter';
  const status = business?.subscription_status || 'trialing';

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Billing</h1>

      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-2xl font-bold capitalize text-brand">{currentPlan}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-700' :
            status === 'trialing' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {status}
          </span>
        </div>
        {business?.trial_ends_at && status === 'trialing' && (
          <p className="mt-2 text-sm text-gray-500">
            Trial ends: {new Date(business.trial_ends_at).toLocaleDateString()}
          </p>
        )}
        {business?.stripe_customer_id && (
          <button
            onClick={handlePortal}
            disabled={actionLoading === 'portal'}
            className="btn btn-secondary mt-4"
          >
            {actionLoading === 'portal' ? 'Loading...' : 'Manage Subscription'}
          </button>
        )}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-900">Available Plans</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`card ${plan.id === currentPlan ? 'border-2 border-brand' : ''}`}>
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">${Math.round(plan.priceMonthly / 100)}</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start text-sm text-gray-600">
                  <svg className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {plan.id === currentPlan ? (
              <div className="mt-6 rounded-lg bg-blue-50 py-2 text-center text-sm font-medium text-brand">
                Current Plan
              </div>
            ) : (
              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={!!actionLoading}
                className="btn btn-primary mt-6 w-full"
              >
                {actionLoading === plan.id ? 'Loading...' : 'Upgrade'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
