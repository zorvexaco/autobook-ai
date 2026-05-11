'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { EmptyState } from '@/components/dashboard/empty-state';

interface AppointmentRow {
  id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  customers: { first_name: string; last_name: string; phone: string } | null;
  services: { name: string; price_cents: number } | null;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: biz } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (!biz) return;

      const { data } = await supabase
        .from('appointments')
        .select('id, scheduled_date, scheduled_time, duration_minutes, status, customers(first_name, last_name, phone), services(name, price_cents)')
        .eq('business_id', biz.id)
        .order('scheduled_date', { ascending: false })
        .limit(50);

      setAppointments((data as any) || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" /></div>;
  }

  if (appointments.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Appointments</h1>
        <EmptyState
          title="No appointments yet"
          description="Appointments booked through your AI receptionist or online booking page will appear here."
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Appointments</h1>
      <div className="card overflow-hidden !p-0">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Service</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{apt.scheduled_date}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{apt.scheduled_time}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {apt.customers ? `${apt.customers.first_name} ${apt.customers.last_name}` : 'Unknown'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{apt.services?.name || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
