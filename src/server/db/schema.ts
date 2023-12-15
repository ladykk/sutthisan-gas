import { RolesId } from "@/static/auth";
import {
  pgTable,
  unique,
  pgEnum,
  uuid,
  timestamp,
  text,
  primaryKey,
} from "drizzle-orm/pg-core";

export const keyStatus = pgEnum("key_status", [
  "expired",
  "invalid",
  "valid",
  "default",
]);
export const keyType = pgEnum("key_type", [
  "stream_xchacha20",
  "secretstream",
  "secretbox",
  "kdf",
  "generichash",
  "shorthash",
  "auth",
  "hmacsha256",
  "hmacsha512",
  "aead-det",
  "aead-ietf",
]);
export const factorType = pgEnum("factor_type", ["webauthn", "totp"]);
export const factorStatus = pgEnum("factor_status", ["verified", "unverified"]);
export const aalLevel = pgEnum("aal_level", ["aal3", "aal2", "aal1"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "plain",
  "s256",
]);

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

export const roles = pgEnum("roles", RolesId);
export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id),
    role: roles("role").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.role] }),
    };
  }
);
