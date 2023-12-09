import { get } from "@vercel/edge-config";

export async function getAllowSignUp() {
  return (await get<boolean>("allowSignUp")) ?? false;
}
