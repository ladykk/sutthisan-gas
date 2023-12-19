"use client";
import { ApplicationBadge } from "@/components/common/applications";
import { RoleBadge } from "@/components/common/roles";
import {
  LayoutHeadContainer,
  LayoutTitle,
} from "@/components/common/theme/dashboard";
import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { APPLICATION_ARRAY } from "@/static/application";
import { ROLE_LIST } from "@/static/auth";

export default function ApplicationPage() {
  return (
    <>
      <LayoutHeadContainer
        left={
          <>
            <LayoutTitle>Applications</LayoutTitle>
          </>
        }
      />
      <DataTable
        data={APPLICATION_ARRAY}
        columns={[
          {
            accessorKey: "label",
            header: "Application",
            cell: ({ row }) => (
              <ApplicationBadge applicationId={row.original.id} />
            ),
          },
          {
            accessorKey: "description",
            header: "Description",
          },
          {
            id: "roles",
            header: "Roles",
            cell: ({ row }) => {
              if (row.original.roles.length === 0) return "-";

              return (
                <TooltipProvider>
                  <div className="flex gap-2 flex-wrap">
                    {row.original.roles.map((id) => (
                      <Tooltip>
                        <TooltipTrigger>
                          <RoleBadge roleId={id} />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-sm">
                          {ROLE_LIST[id].description}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              );
            },
          },
        ]}
      />
    </>
  );
}
