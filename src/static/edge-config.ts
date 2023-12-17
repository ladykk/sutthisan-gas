import { z } from "zod";

export const EDGE_CONFIG_KEYS = ["allowSignUp"] as const;

export const EDGE_CONFIG_GROUP_ID = ["Authentication"] as const;

export const EDGE_CONFIG_SCHEMA = {
  allowSignUp: z.boolean().default(true),
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
};

export type TEdgeConfigKey = (typeof EDGE_CONFIG_KEYS)[number];
const EDGE_CONFIG_SCHEMA_OBJECT = z.object(EDGE_CONFIG_SCHEMA).default({});
type TEdgeConfig = z.infer<typeof EDGE_CONFIG_SCHEMA_OBJECT>;
export type TEdgeConfigValue<Key extends TEdgeConfigKey> = TEdgeConfig[Key];
export type TEdgeConfigGroupId = (typeof EDGE_CONFIG_GROUP_ID)[number];
type TEdgeConfigGroupItem<Key extends TEdgeConfigKey> = {
  key: Key;
  label: string;
};
type TEdgeConfigGroup = {
  id: TEdgeConfigGroupId;
  name: string;
  items: Array<TEdgeConfigGroupItem<TEdgeConfigKey>>;
};
