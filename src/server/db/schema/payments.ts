import {
  PAYMENT_STATUS_ID_ARRAY,
  PAYMENT_TYPE_ID_ARRAY,
} from "@/static/payment";
import { boolean, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

// Payment Types
export const paymentTypes = pgEnum("payment_types", PAYMENT_TYPE_ID_ARRAY);

// Payment Status
export const paymentStatuses = pgEnum(
  "payment_statuses",
  PAYMENT_STATUS_ID_ARRAY
);

// Banks
export const banks = pgTable("banks", {
  id: serial("id").primaryKey(),
  nameTH: text("name_th").notNull(),
  nameEN: text("name_en").notNull(),
  logoUrl: text("logo_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});
