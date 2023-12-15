"use client";
import { TGetUser } from "@/server/actions/auth";
import { Button, buttonVariants } from "../ui/button";
import { cn, getNamePrefix } from "@/lib/utils";
import { Fragment, useMemo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "@/server/actions/auth";
import { useMutation } from "@tanstack/react-query";
import { storage } from "@/lib/supabase";
import { AVATAR_BUCKET } from "@/server/db/storage";
import { Card } from "../ui/card";

type AuthSessionProps = {
  user?: TGetUser;
  className?: string;
  classNames?: {
    signOutButton?: string;
    manageProfileButton?: string;
  };
  onlySession?: boolean;
};

export default function AuthSession(props: AuthSessionProps) {
  const mutation = useMutation({
    mutationFn: signOut,
  });

  if (!props.user && props.onlySession) return null;

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
                "h-fit p-0",
                props.classNames?.manageProfileButton
              )}
            >
              Manage Profile
            </Link>
          </div>
          <AuthAvatar
            src={props.user.avatarUrl}
            fullName={props.user.fullName}
            className="h-10 w-10 ml-2"
          />
          <Button
            className={cn("ml-2", props.classNames?.signOutButton)}
            loading={mutation.isPending}
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

type AuthAvatarProps = {
  className?: string;
  src: string | null;
  fullName: string | null;
};

export function AuthAvatar(props: AuthAvatarProps) {
  const src = useMemo(() => {
    if (props.src)
      return storage.from(AVATAR_BUCKET).getPublicUrl(props.src).data.publicUrl;
    else return "";
  }, []);
  return (
    <Avatar
      className={props.className}
      style={{ containerType: "inline-size" }}
    >
      <AvatarImage src={src} />
      <AvatarFallback className=" text-[1.8cqh]">
        {getNamePrefix(props.fullName)}
      </AvatarFallback>
    </Avatar>
  );
}

type AuthCardProps = {
  avatarUrl: string | null;
  fullName: string | null;
  email: string | null;
};

export function AuthCard(props: AuthCardProps) {
  return (
    <Card className="px-5 py-3 flex gap-5 items-center">
      <AuthAvatar
        src={props.avatarUrl}
        fullName={props.fullName}
        className="w-16 h-16"
      />
      <div>
        <p className="font-medium">{props.fullName}</p>
        <p className="text-muted-foreground text-sm">{props.email}</p>
      </div>
    </Card>
  );
}
