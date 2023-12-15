"use client";

import { MENU_ITEMS } from "@/static/backoffice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  className?: string;
  onLinkClick?: () => void;
};

export default function BackofficeSidebar(props: Props) {
  const pathName = usePathname();
  const currentBaseUrl = pathName.split("/")[2] ?? MENU_ITEMS[0].baseUrl;
  const currentUrl = pathName.split("/")[3] ?? "";

  const [value, setValue] = useState(currentBaseUrl);

  return (
    <div
      className={cn(
        "bg-white fixed left-0 top-[3.5rem] bottom-0 w-[300px] overflow-x-hidden overflow-y-auto shadow-md px-3",
        props.className
      )}
    >
      <Accordion
        type="single"
        collapsible
        value={value}
        onValueChange={setValue}
      >
        {MENU_ITEMS.map((item) => (
          <AccordionItem key={item.baseUrl} value={item.baseUrl}>
            <AccordionTrigger className="text-sm">
              <div className="flex gap-2 items-end">
                <item.icon />
                {item.label}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {item.children.map((child) => (
                <Link
                  key={child.url}
                  href={`/backoffice/${item.baseUrl}/${child.url}`}
                  className={cn(
                    buttonVariants({
                      variant: currentUrl === child.url ? "default" : "ghost",
                    }),
                    "w-full justify-start"
                  )}
                  onClick={props.onLinkClick}
                >
                  {child.label}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
