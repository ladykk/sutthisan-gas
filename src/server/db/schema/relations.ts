import { relations } from "drizzle-orm";
import { profiles, userRoles } from "./users";
import { banks } from "./payments";
import { companyPaymentChannels } from "./companies";

export const userRolesRelation = relations(userRoles, ({ one }) => ({
  profile: one(profiles, {
    fields: [userRoles.userId],
    references: [profiles.id],
  }),
}));

export const banksRelation = relations(banks, ({ many }) => ({
  companyPaymentChannels: many(companyPaymentChannels),
}));

export const companyPaymentChannelsRelation = relations(
  companyPaymentChannels,
  ({ one }) => ({
    bank: one(banks, {
      fields: [companyPaymentChannels.bankId],
      references: [banks.id],
    }),
  })
);
