import { env } from "@/env.mjs";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export const SBServerClient = (cookieStore: ReturnType<typeof cookies>) =>
  createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key) {
          return cookieStore.get(key)?.value;
        },
        set(key, value, options) {
          cookieStore.set({
            name: key,
            value,
            ...options,
          });
        },
        remove(key, options) {
          cookieStore.set({
            name: key,
            value: "",
            ...options,
          });
        },
      },
    }
  );
