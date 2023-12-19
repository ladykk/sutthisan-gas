"use client";
import {
  APPLICATION_ID_ARRAY,
  APPLICATION_LIST,
  TApplicationId,
} from "@/static/application";
import { Badge, BadgeProps } from "../ui/badge";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useApplicationId } from "@/lib/hooks/applications";

type ApplicationBadgeProps = BadgeProps & {
  applicationId: TApplicationId;
};

export function ApplicationBadge(props: ApplicationBadgeProps) {
  return (
    <Badge
      {...props}
      style={{
        ...props.style,
        backgroundColor: APPLICATION_LIST[props.applicationId].colorCode,
      }}
    >
      {APPLICATION_LIST[props.applicationId].label}
    </Badge>
  );
}

type ApplicationSwitchProps = {
  ORGANIZATION_NAME: string;
};

export function ApplicationSwitch(props: ApplicationSwitchProps) {
  const applicationId = useApplicationId();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="font-bold text-base px-2 xl:px-3">
          {props.ORGANIZATION_NAME}
          <ApplicationBadge className="ml-2" applicationId={applicationId} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="right" className="p-0 w-fit">
        <p className="h-10 text-sm font-semibold border-b px-3 flex items-center">
          Switch Application
        </p>
        <div className="flex flex-col">
          {APPLICATION_ID_ARRAY.map((applicationId) => (
            <Link
              key={applicationId}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                }),
                "justify-start"
              )}
              href={APPLICATION_LIST[applicationId].path}
            >
              <ApplicationBadge applicationId={applicationId} />
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
