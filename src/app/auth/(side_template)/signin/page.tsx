import { signIn } from "@/server/actions/auth";
import SignInClient from "./client";
import { getAllowSignUp } from "@/server/edge-config";
import { env } from "@/env.mjs";

export const metadata = {
  title: `Sign In | ${env.NEXT_PUBLIC_ORGANIZATION_NAME}`,
};

export default async function SignInPage() {
  const allowSignUp = await getAllowSignUp();
  return (
    <div className="flex justify-center items-center flex-1">
      <SignInClient mutationFn={signIn} allowSignup={allowSignUp} />
    </div>
  );
}
