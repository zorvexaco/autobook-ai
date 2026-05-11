'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { EmptyState } from '@/components/dashboard/empty-state';

export default function SettingsPage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    if (!business) return;
    setSaving(true);
    await supabase.from('businesses').update({
      name: business.name,
      phone: business.phone,
      email: business.email,
      website: business.website,
      city: business.city,
      state: business.state,
      address: business.address,
    }).eq('id', business.id);
    setSaving(false);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" /></div>;
  }

  if (!business) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Settings</h1>
        <EmptyState title="No business found" description="Complete onboarding to configure your business." />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Business Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <input type="text" value={business.name || ''} onChange={(e) => setBusiness({ ...business, name: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Type</label>
            <input type="text" value={business.business_type || ''} disabled className="input-field mt-1 bg-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" value={business.phone || ''} onChange={(e) => setBusiness({ ...business, phone: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={business.email || ''} onChange={(e) => setBusiness({ ...business, email: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input type="url" value={business.website || ''} onChange={(e) => setBusiness({ ...business, website: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" value={business.address || ''} onChange={(e) => setBusiness({ ...business, address: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input type="text" value={business.city || ''} onChange={(e) => setBusiness({ ...business, city: e.target.value })} className="input-field mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input type="text" value={business.state || ''} onChange={(e) => setBusiness({ ...business, state: e.target.value })} className="input-field mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
