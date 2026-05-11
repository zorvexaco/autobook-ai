import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
}

function getSupabaseKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';
}

function getAccessTokenFromCookies(request: NextRequest): string | null {
  const allCookies = request.cookies.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')) {
      try {
        const parsed = JSON.parse(cookie.value);
        if (Array.isArray(parsed) && parsed[0]) return parsed[0];
        if (typeof parsed === 'string') return parsed;
      } catch {}
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes - no auth needed
  const publicRoutes = ['/', '/pricing', '/login', '/signup', '/auth/callback', '/auth/confirm'];
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith('/api/webhooks'));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Read auth token from cookies
  const accessToken = getAccessTokenFromCookies(request);

  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // Verify user with Supabase
  const supabase = createClient(getSupabaseUrl(), getSupabaseKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // Check if user needs onboarding
  if (path !== '/onboarding' && path.startsWith('/dashboard')) {
    const { data: business } = await supabase
      .from('businesses')
      .select('onboarding_completed')
      .eq('owner_id', user.id)
      .single();

    if (!business || !business.onboarding_completed) {
      const url = request.nextUrl.clone();
      url.pathname = '/onboarding';
      return NextResponse.redirect(url);
    }
  }

  if (path === '/onboarding') {
    const { data: business } = await supabase
      .from('businesses')
      .select('onboarding_completed')
      .eq('owner_id', user.id)
      .single();

    if (business?.onboarding_completed) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  if (path === '/login' || path === '/signup') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
