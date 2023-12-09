"use client";
import { TGetSession, TSignOutFn } from "@/server/actions/auth";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "react-query";
import { Fragment } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getNamePrefix } from "@/lib/auth";

type AuthSessionProps = {
  session: TGetSession;
  className?: string;
  mutationFn: TSignOutFn;
};

export default function AuthSession(props: AuthSessionProps) {
  const { user } = props.session;
  const mutation = useMutation({
    mutationFn: props.mutationFn,
  });

  return (
    <div className={cn("flex", props.className)}>
      {user ? (
        <Fragment>
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium">Welcome, {user.fullName}</p>
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
            <AvatarImage src={user.avatarUrl ?? ""} />
            <AvatarFallback>{getNamePrefix(user.fullName)}</AvatarFallback>
          </Avatar>
          <Button
            className="ml-2"
            loading={mutation.isLoading}
            onClick={() => mutation.mutate()}
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
