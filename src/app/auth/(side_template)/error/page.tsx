import { buttonVariants } from "@/components/ui/button";
import { signOut } from "@/server/actions/auth";
import { AuthErrorCode } from "@/static/auth";
import { LogIn, LucideIcon, Network, UserX } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: { code: AuthErrorCode; callbackUrl?: string };
}) {
  await signOut();
  return (
    <div className="flex justify-center items-center flex-col flex-1">
      {searchParams.code === "NoSession" ? (
        <Template Icon={LogIn} title="No Session">
          This page requires an active session.
          <br />
          Please sign in to continue.
        </Template>
      ) : searchParams.code === "NoPermission" ? (
        <Template Icon={Network} title="No Permission">
          This account does not have permission to access this page.
          <br />
          Please contact your administrator.
        </Template>
      ) : searchParams.code === "SignUpDisabled" ? (
        <Template Icon={UserX} title="Sign Up Disabled">
          Sign up is currently disabled.
          <br />
          Please contact your administrator.
        </Template>
      ) : null}
      <div className="space-x-3">
        <Link
          href={`/auth/signin${
            searchParams.callbackUrl
              ? `?callbackUrl=${searchParams.callbackUrl}`
              : ""
          }`}
          className={buttonVariants()}
          replace
        >
          Back to Sign In
        </Link>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline" })}
          replace
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

const Template = ({
  Icon,
  title,
  children,
}: {
  Icon: LucideIcon;
  title: string;
  children: ReactNode;
}) => {
  return (
    <>
      <Icon className="w-20 h-20 mb-5" />
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground text-center mb-5">{children}</p>
    </>
  );
};
