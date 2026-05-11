'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { EmptyState } from '@/components/dashboard/empty-state';
import { formatCurrency } from '@/lib/utils';

interface ServiceRow {
  id: string;
  name: string;
  price_cents: number;
  duration_minutes: number;
  is_bookable: boolean;
  is_active: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: biz } = await supabase.from('businesses').select('id').eq('owner_id', user.id).single();
      if (!biz) return;

      const { data } = await supabase
        .from('services')
        .select('id, name, price_cents, duration_minutes, is_bookable, is_active')
        .eq('business_id', biz.id)
        .order('sort_order');

      setServices(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" /></div>;
  }

  if (services.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Services</h1>
        <EmptyState title="No services configured" description="Add services during onboarding or from this page to enable booking." />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Services ({services.length})</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="card">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900">{s.name}</h3>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {s.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
              <span>{formatCurrency(s.price_cents)}</span>
              <span>{s.duration_minutes} min</span>
              <span>{s.is_bookable ? 'Bookable' : 'Not bookable'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
