"use client";
import { ReactNode, useState } from "react";
import { Button, buttonVariants } from "../../ui/button";
import { LucideIcon, Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AuthSession from "../auth";
import { TGetUser } from "@/server/actions/auth";
import { ApplicationSwitch } from "../applications";
import { TRoleId } from "@/static/auth";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useApplicationId } from "@/lib/hooks/applications";
import { MENU_ITEMS } from "@/static/dashboard";

type DashboardLayoutProps = {
  children: ReactNode;
  ORGANIZATION_NAME: string;
  user: TGetUser;
};

export function DashboardLayout(props: DashboardLayoutProps) {
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
        <ApplicationSwitch ORGANIZATION_NAME={props.ORGANIZATION_NAME} />
        <div className="flex-1" />
        <AuthSession user={props.user} className="mx-3" onlySession />
      </div>
      <DashboardSidebar
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
          "p-5 flex-1 transition-transform xl:ml-[300px] flex flex-col bg-white/60",
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

export type DashboardSidebarLink = {
  label: string;
  url: string;
};

export type DashboardSidebarMenu = {
  label: string;
  baseUrl: string;
  icon: LucideIcon;
  roles: Array<TRoleId>;
  links: Array<DashboardSidebarLink>;
};

type DashboardSidebarProps = {
  className?: string;
  onLinkClick?: () => void;
};

export default function DashboardSidebar(props: DashboardSidebarProps) {
  const applicationId = useApplicationId();
  const menu = MENU_ITEMS[applicationId];
  const pathName = usePathname();
  const currentBaseUrl = pathName.split("/")[2] ?? menu[0].baseUrl;
  const currentUrl = pathName.split("/")[3] ?? "";

  const [value, setValue] = useState(currentBaseUrl);

  return (
    <div
      className={cn(
        "bg-white fixed left-0 top-[3.5rem] bottom-0 w-[300px] overflow-x-hidden overflow-y-auto shadow-md px-3 border-r",
        props.className
      )}
    >
      <Accordion
        type="single"
        collapsible
        value={value}
        onValueChange={setValue}
      >
        {menu.map((item) => (
          <AccordionItem key={item.baseUrl} value={item.baseUrl}>
            <AccordionTrigger className="text-sm">
              <div className="flex gap-2 items-end">
                <item.icon />
                {item.label}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {item.links.map((link) => (
                <Link
                  key={link.url}
                  href={`/backoffice/${item.baseUrl}/${link.url}`}
                  className={cn(
                    buttonVariants({
                      variant: currentUrl === link.url ? "default" : "ghost",
                    }),
                    "w-full justify-start"
                  )}
                  onClick={props.onLinkClick}
                >
                  {link.label}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
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
