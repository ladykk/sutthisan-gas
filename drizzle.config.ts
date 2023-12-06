import { drizzleEnv } from "@/env.mjs";
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: drizzleEnv.DATABASE_URL,
  },
} satisfies Config;
