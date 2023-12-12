"use client";
import { TGetUser } from "@/server/actions/auth";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getNamePrefix } from "@/lib/auth";
import { useAction } from "next-safe-action/hook";
import { signOut } from "@/server/actions/auth";

type AuthSessionProps = {
  user: TGetUser;
  className?: string;
};

export default function AuthSession(props: AuthSessionProps) {
  const action = useAction(signOut);

  return (
    <div className={cn("flex", props.className)}>
      {props.user ? (
        <Fragment>
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium">
              Welcome, {props.user.fullName}
            </p>
            <Link
              href="/auth/profile"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "h-fit p-0"
              )}
            >
              Manage Profile
            </Link>
          </div>
          <Avatar className="ml-2">
            <AvatarImage src={props.user.avatarUrl ?? ""} />
            <AvatarFallback>
              {getNamePrefix(props.user.fullName)}
            </AvatarFallback>
          </Avatar>
          <Button
            className="ml-2"
            loading={action.status === "executing"}
            onClick={() => action.execute()}
          >
            Sign Out
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <Link href="/auth/signin" className={buttonVariants({})}>
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "ml-2"
            )}
          >
            Sign Up
          </Link>
        </Fragment>
      )}
    </div>
  );
}
