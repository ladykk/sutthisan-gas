import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from "./lib/supabase";
export const env = createEnv({
  isServer: typeof window === "undefined",
  server: {
    DATABASE_URL: z.string().url(),
    EDGE_CONFIG: z.string().url(),
    VERCEL_TOKEN: z.string(),
    EDGE_CONFIG_ID: z.string(),
    EDGE_CONFIG: z.string(),
    VERCEL_TEAM_ID: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_ENV: z.enum(["DEV", "PRD"]),
    NEXT_PUBLIC_ORGANIZATION_NAME: z.string(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  },
  runtimeEnv: {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  emptyStringAsUndefined: true,
});
