import { zodPhoneNumber, zodTaxId } from "@/server/zod";
import { z } from "zod";

export const EDGE_CONFIG_KEYS = ["allowSignUp", "companyInfo"] as const;

export const EDGE_CONFIG_GROUP_ID = ["Authentication"] as const;

export const EDGE_CONFIG_SCHEMA = {
  allowSignUp: z.boolean().default(true),
  companyInfo: z
    .object({
      telNo: zodPhoneNumber.optional(),
      taxId: zodTaxId.optional(),
      companyNameLocal: z.string().optional(),
      ownerNameLocal: z.string().optional(),
      locationNameLocal: z.string().optional(),
      addressLocal: z.string().optional(),
      companyNameEng: z.string().optional(),
      ownerNameEng: z.string().optional(),
      locationNameEng: z.string().optional(),
      addressEng: z.string().optional(),
    })
    .default({}),
} as const;

export const EDGE_CONFIG: Record<
  TEdgeConfigKey,
  {
    id: TEdgeConfigKey;
    label: string;
  }
> = {
  allowSignUp: {
    id: "allowSignUp",
    label: "Allow Sign Up",
  },
  companyInfo: {
    id: "companyInfo",
    label: "Company Info",
  },
};

export type TEdgeConfigKey = (typeof EDGE_CONFIG_KEYS)[number];
const EDGE_CONFIG_SCHEMA_OBJECT = z.object(EDGE_CONFIG_SCHEMA).default({});
type TEdgeConfig = z.infer<typeof EDGE_CONFIG_SCHEMA_OBJECT>;
export type TEdgeConfigValue<Key extends TEdgeConfigKey> = TEdgeConfig[Key];
export type TEdgeConfigGroupId = (typeof EDGE_CONFIG_GROUP_ID)[number];
