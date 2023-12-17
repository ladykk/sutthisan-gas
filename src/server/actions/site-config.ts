"use server";
import { EDGE_CONFIG_KEYS, EDGE_CONFIG_SCHEMA } from "@/static/edge-config";
import { z } from "zod";

import { roleAction } from ".";
import { Roles } from "@/static/auth";
import { getEdgeConfigs, setEdgeConfig } from "../edge-config";

// Get Site Config Backoffice
export const getSiteConfigBackoffice = roleAction([Roles.Administrator])(
  z.array(z.enum(EDGE_CONFIG_KEYS)),
  async (input) => {
    return await getEdgeConfigs(input);
  }
);

// Set Site Config Backoffice
const setSiteConfigBackofficeSchema = z.array(
  z.object({
    key: z.enum(EDGE_CONFIG_KEYS),
    value: z.boolean(),
  })
);
export type TSetSiteConfigBackofficeInput = z.infer<
  typeof setSiteConfigBackofficeSchema
>;

export const setSiteConfigBackoffice = roleAction([Roles.Administrator])(
  setSiteConfigBackofficeSchema,
  async (input) => {
    return await setEdgeConfig(input);
  }
);
