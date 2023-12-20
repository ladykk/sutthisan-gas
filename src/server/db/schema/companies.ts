import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { banks, paymentTypes } from "./payments";

export const companyPaymentChannels = pgTable("company_payment_channels", {
  id: serial("id").primaryKey(),
  paymentType: paymentTypes("payment_type").notNull(),
  bankId: integer("bank_id").references(() => banks.id, {
    onUpdate: "cascade",
    onDelete: "restrict",
  }),
  paymentName: text("payment_name").notNull(),
  paymentInfo: text("payment_info").notNull(),
});
