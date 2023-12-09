import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/env.mjs";
import { sql } from "drizzle-orm";
const connectionString = env.DATABASE_URL;
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, {
  schema,
});

export const CURRENT_TIMESTAMP = sql`CURRENT_TIMESTAMP`;
