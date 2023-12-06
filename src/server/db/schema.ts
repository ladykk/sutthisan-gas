import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").notNull().primaryKey(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  username: text("username").unique(),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
});
