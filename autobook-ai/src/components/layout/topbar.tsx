'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function Topbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="lg:hidden">
        <span className="text-lg font-bold text-gray-900">AutoBook AI</span>
      </div>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        {userEmail && (
          <span className="hidden text-sm text-gray-500 sm:block">{userEmail}</span>
        )}
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
