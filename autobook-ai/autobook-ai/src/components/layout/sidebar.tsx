'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '\u25A6' },
  { label: 'Appointments', href: '/dashboard/appointments', icon: '\uD83D\uDCC5' },
  { label: 'Customers', href: '/dashboard/customers', icon: '\uD83D\uDC65' },
  { label: 'Services', href: '/dashboard/services', icon: '\u2630' },
  { label: 'AI Settings', href: '/dashboard/ai-settings', icon: '\u2728' },
  { label: 'Settings', href: '/dashboard/settings', icon: '\u2699' },
  { label: 'Billing', href: '/dashboard/billing', icon: '\uD83D\uDCB3' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('businesses')
        .select('name')
        .eq('owner_id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setBusinessName(data.name);
        });
    });
  }, []);

  function isActive(href: string): boolean {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <svg
          className="h-7 w-7 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
        </svg>
        <span className="text-lg font-bold text-gray-900">AutoBook AI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <span className="text-base leading-none" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Business name */}
      {businessName && (
        <div className="border-t border-gray-200 px-6 py-4">
          <p className="truncate text-xs font-medium text-gray-500">{businessName}</p>
        </div>
      )}
    </aside>
  );
}
