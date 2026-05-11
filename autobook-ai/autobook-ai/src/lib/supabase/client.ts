import { createClient as _createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Singleton browser Supabase client.
 * Uses @supabase/supabase-js directly (not @supabase/ssr) to avoid
 * strict URL/key validation that crashes during SSG builds.
 * Falls back to placeholder values at build time; real env vars are
 * used at runtime in the browser.
 */
export function createClient(): SupabaseClient {
  if (_client) return _client;
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://placeholder.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "placeholder-anon-key";
  _client = _createClient(url, key);
  return _client;
}
