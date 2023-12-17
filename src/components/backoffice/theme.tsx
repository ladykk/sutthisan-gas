"use client";
import { ReactNode, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AuthSession from "../common/auth";
import BackofficeSidebar from "./sidebar";
import { TGetUser } from "@/server/actions/auth";

type LayoutBackOfficeProps = {
  children: ReactNode;
  ORGANIZATION_NAME: string;
  user: TGetUser;
};

export function LayoutBackOffice(props: LayoutBackOfficeProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-muted flex flex-col pt-[3.5rem] overflow-x-hidden">
      <div className="bg-white h-14 shadow-md flex items-center justify-between fixed top-0 left-0 right-0 z-10">
        <Button
          size="icon"
          variant="ghost"
          className="ml-3 xl:hidden"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <Menu />
        </Button>
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "font-semibold text-base"
          )}
          href="/backoffice"
        >
          {props.ORGANIZATION_NAME} Back Office
        </Link>
        <div className="flex-1" />
        <AuthSession user={props.user} className="mx-3" onlySession />
      </div>
      <BackofficeSidebar
        className={cn(
          "transition-transform",
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-[300px] xl:-translate-x-[0px]"
        )}
        onLinkClick={() => setIsSidebarOpen(false)}
      />
      <div
        className={cn(
          "p-5 flex-1 transition-transform xl:ml-[300px] flex flex-col",
          isSidebarOpen
            ? "translate-x-[300px] xl:translate-x-[0]"
            : "translate-x-0"
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

export function LayoutHeadContainer({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4 h-12">
      <div className="flex gap-2 items-baseline">{left}</div>
      <div className="flex gap-2 items-baseline">{right}</div>
    </div>
  );
}

export function LayoutTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
      {children}
    </h1>
  );
}
