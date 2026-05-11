'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { EmptyState } from '@/components/dashboard/empty-state';
import { formatCurrency } from '@/lib/utils';

interface CustomerRow {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  total_appointments: number;
  total_revenue_cents: number;
  last_visit_date: string | null;
  source: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: biz } = await supabase.from('businesses').select('id').eq('owner_id', user.id).single();
      if (!biz) return;

      const { data } = await supabase
        .from('customers')
        .select('id, first_name, last_name, phone, email, total_appointments, total_revenue_cents, last_visit_date, source')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false })
        .limit(100);

      setCustomers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" /></div>;
  }

  if (customers.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Customers</h1>
        <EmptyState title="No customers yet" description="Customer records are created automatically when they book appointments or call your business." />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Customers ({customers.length})</h1>
      <div className="card overflow-hidden !p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Appointments</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Revenue</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.first_name} {c.last_name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.total_appointments}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatCurrency(c.total_revenue_cents)}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{c.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
