import { cookies } from "next/headers";

function getUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://placeholder.supabase.co"
  );
}

function getKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "placeholder-anon-key"
  );
}

/**
 * Creates a Supabase server client with cookie-based auth.
 * Dynamically imports @supabase/ssr to avoid module-level
 * validation crashes during static page generation.
 */
export async function createServerSupabase() {
  const { createServerClient } = await import("@supabase/ssr");
  const cookieStore = cookies();

  return createServerClient(getUrl(), getKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options?: any }[]
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Cannot set cookies from Server Components
        }
      },
    },
  });
}
