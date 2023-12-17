import { get, getAll } from "@vercel/edge-config";
import { env } from "@/env.mjs";
import {
  EDGE_CONFIG_SCHEMA,
  TEdgeConfigKey,
  TEdgeConfigValue,
} from "@/static/edge-config";

export async function getEdgeConfig<Key extends TEdgeConfigKey>(
  key: Key
): Promise<TEdgeConfigValue<Key>> {
  const value = await get(key);
  return EDGE_CONFIG_SCHEMA[key].parse(value) as TEdgeConfigValue<Key>;
}

export async function getEdgeConfigs<Key extends TEdgeConfigKey>(keys: Key[]) {
  const values = await getAll(keys);
  return keys.reduce((acc, key) => {
    acc[key] = EDGE_CONFIG_SCHEMA[key].parse(
      values[key]
    ) as TEdgeConfigValue<Key>;
    return acc;
  }, {} as Record<Key, TEdgeConfigValue<Key>>);
}

export async function setEdgeConfig<Key extends TEdgeConfigKey>(
  items: Array<{ key: Key; value: TEdgeConfigValue<Key> }>
) {
  return await fetch(
    `https://api.vercel.com/v1/edge-config/${env.EDGE_CONFIG_ID}/items?teamId=${env.VERCEL_TEAM_ID}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map(({ key, value }) => ({
          operation: "upsert",
          key,
          value,
        })),
      }),
    }
  )
    .then((res) => res.json().then((data) => data.status === "ok"))
    .catch(() => false);
}
