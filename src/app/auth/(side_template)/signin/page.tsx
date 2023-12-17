import { getEdgeConfig } from "@/server/edge-config";
import SignInClient from "./client";
import { env } from "@/env.mjs";

export const metadata = {
  title: `Sign In | ${env.NEXT_PUBLIC_ORGANIZATION_NAME}`,
};

export default async function SignInPage() {
  const allowSignUp = await getEdgeConfig("allowSignUp");
  return (
    <div className="flex justify-center items-center flex-1">
      <SignInClient allowSignup={allowSignUp} />
    </div>
  );
}
