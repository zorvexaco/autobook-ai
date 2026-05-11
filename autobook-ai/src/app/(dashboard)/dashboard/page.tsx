'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { StatsCard } from '@/components/dashboard/stats-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { formatCurrency } from '@/lib/utils';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    todayAppointments: 0,
  });
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: biz } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', user.id)
        .single();

      if (!biz) return;
      setBusinessName(biz.name);

      const today = new Date().toISOString().split('T')[0];

      const [appts, customers, todayAppts] = await Promise.all([
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('business_id', biz.id),
        supabase.from('customers').select('id, total_revenue_cents').eq('business_id', biz.id),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('business_id', biz.id).eq('scheduled_date', today),
      ]);

      const totalRevenue = customers.data?.reduce((sum, c) => sum + (c.total_revenue_cents || 0), 0) || 0;

      setStats({
        totalAppointments: appts.count || 0,
        totalCustomers: customers.data?.length || 0,
        totalRevenue,
        todayAppointments: todayAppts.count || 0,
      });
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Welcome back, {businessName}</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Today's Appointments" value={stats.todayAppointments.toString()} />
        <StatsCard title="Total Appointments" value={stats.totalAppointments.toString()} />
        <StatsCard title="Total Customers" value={stats.totalCustomers.toString()} />
        <StatsCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} />
      </div>

      {stats.totalAppointments === 0 && (
        <EmptyState
          title="No appointments yet"
          description="When customers book through your AI receptionist or online, appointments will appear here."
        />
      )}
    </div>
  );
}
