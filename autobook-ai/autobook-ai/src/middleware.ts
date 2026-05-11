import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Public routes - no auth needed
  const publicRoutes = ['/', '/pricing', '/login', '/signup', '/auth/callback', '/auth/confirm'];
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith('/api/webhooks'));

  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Not authenticated - redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // Check if user needs onboarding (except if already on onboarding page)
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

  // User is on onboarding but already completed - redirect to dashboard
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

  // Authenticated users trying to access login/signup - redirect to dashboard
  if (path === '/login' || path === '/signup') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
