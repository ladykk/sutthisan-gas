import { headers } from "next/headers";

export function getCallbackUrl() {
  const headersList = headers();
  const header_next_url = headersList.get("x-next-url");
  return header_next_url || "";
}
