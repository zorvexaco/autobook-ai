import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Singleton browser Supabase client.
 * Uses placeholder URL/key during SSG so the build doesn't crash;
 * actual requests only happen client-side inside useEffect.
 */
export function createClient(): SupabaseClient {
  if (_client) return _client;
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
  _client = createBrowserClient(url, key);
  return _client;
}
