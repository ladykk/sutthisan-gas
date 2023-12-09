import { getAllowSignUp } from "@/server/edge-config";
import SignUpClient from "./client";
import { UserX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { env } from "@/env.mjs";
import { signUp } from "@/server/actions/auth";

export const metadata = {
  title: `Sign Up | ${env.NEXT_PUBLIC_ORGANIZATION_NAME}`,
};

export default async function SignUpPage() {
  const allowSignUp = await getAllowSignUp();
  return (
    <div className="flex-1 flex justify-center items-center">
      {allowSignUp ? <SignUpClient mutationFn={signUp} /> : <RestrictSignUp />}
    </div>
  );
}

function RestrictSignUp() {
  return (
    <div className="flex justify-center items-center flex-col">
      <UserX className="w-20 h-20 mb-5" />
      <h1 className="text-3xl font-bold mb-2">Sign Up Disabled</h1>
      <p className="text-muted-foreground text-center mb-5">
        Sign up is currently disabled.
        <br />
        Please contact your administrator.
      </p>
      <Link href="/auth/signin" className={buttonVariants()} replace>
        Back to Sign In
      </Link>
    </div>
  );
}
