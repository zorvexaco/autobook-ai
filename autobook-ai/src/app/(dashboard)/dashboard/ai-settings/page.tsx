'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { EmptyState } from '@/components/dashboard/empty-state';
import { TONES } from '@/lib/constants/tone-presets';

export default function AiSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: biz } = await supabase.from('businesses').select('id').eq('owner_id', user.id).single();
      if (!biz) return;

      const { data } = await supabase.from('ai_settings').select('*').eq('business_id', biz.id).single();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await supabase.from('ai_settings').update({
      ai_name: settings.ai_name,
      tone: settings.tone,
      greeting_message: settings.greeting_message,
      after_hours_message: settings.after_hours_message,
    }).eq('id', settings.id);
    setSaving(false);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" /></div>;
  }

  if (!settings) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">AI Settings</h1>
        <EmptyState title="AI not configured" description="Complete the onboarding wizard to set up your AI receptionist." />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">AI Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="card space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">AI Name</label>
            <input
              type="text"
              value={settings.ai_name || ''}
              onChange={(e) => setSettings({ ...settings, ai_name: e.target.value })}
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tone</label>
            <select
              value={settings.tone || 'friendly'}
              onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
              className="input-field mt-1"
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Greeting Message</label>
          <textarea
            value={settings.greeting_message || ''}
            onChange={(e) => setSettings({ ...settings, greeting_message: e.target.value })}
            className="input-field mt-1"
            rows={3}
            placeholder="Custom greeting for incoming calls..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">After-Hours Message</label>
          <textarea
            value={settings.after_hours_message || ''}
            onChange={(e) => setSettings({ ...settings, after_hours_message: e.target.value })}
            className="input-field mt-1"
            rows={3}
            placeholder="Message played when business is closed..."
          />
        </div>
      </div>
    </div>
  );
}
