import SignUpClient from "./client";
import { env } from "@/env.mjs";
import { getEdgeConfig } from "@/server/edge-config";
import { redirect } from "next/navigation";
export const metadata = {
  title: `Sign Up | ${env.NEXT_PUBLIC_ORGANIZATION_NAME}`,
};

export default async function SignUpPage() {
  const allowSignUp = await getEdgeConfig("allowSignUp");

  if (!allowSignUp) redirect("/auth/error?code=SignUpDisabled");

  return (
    <div className="flex-1 flex justify-center items-center">
      <SignUpClient />
    </div>
  );
}
