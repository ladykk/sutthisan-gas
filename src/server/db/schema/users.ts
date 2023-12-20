import { ROLE_ID_ARRAY } from "@/static/role";
import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// Profiles
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().notNull(),
    email: text("email").notNull(),
    fullName: text("full_name"),
    phoneNumber: text("phone_number"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      profilesEmailKey: unique("profiles_email_key").on(table.email),
    };
  }
);

// Roles
export const roles = pgEnum("roles", ROLE_ID_ARRAY);
export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    role: roles("role").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.role] }),
    };
  }
);
