import { env } from "@/env.mjs";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export const SBServerClient = (cookieStore: ReturnType<typeof cookies>) =>
  createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(key) {
          return cookieStore.get(key)?.value;
        },
        set(key, value, options) {
          try {
            cookieStore.set({
              name: key,
              value,
              ...options,
            });
          } catch (e) {}
        },
        remove(key, options) {
          try {
            cookieStore.set({
              name: key,
              value: "",
              ...options,
            });
          } catch (e) {}
        },
      },
    }
  );
