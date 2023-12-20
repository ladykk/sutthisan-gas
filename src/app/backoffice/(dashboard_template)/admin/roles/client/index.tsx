"use client";
import { ApplicationBadge } from "@/components/common/applications";
import { RoleBadge } from "@/components/common/roles";
import {
  LayoutHeadContainer,
  LayoutTitle,
} from "@/components/common/theme/dashboard";
import { DataTable } from "@/components/ui/data-table";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { actionQuery } from "@/lib/actions";
import { getRolesUserCount } from "@/server/actions/user";
import {
  APPLICATION_LIST,
  getApplicationsByRoleId,
} from "@/static/application";
import { ROLE_ARRAY } from "@/static/role";
import { useQuery } from "@tanstack/react-query";

export default function RoleClient() {
  const query = useQuery({
    queryKey: ["rolesUserCount"],
    queryFn: () => actionQuery(getRolesUserCount)(),
  });
  return (
    <>
      <LayoutHeadContainer
        left={
          <>
            <LayoutTitle>Roles</LayoutTitle>
            {query.isFetching && <Spinner />}
          </>
        }
      />
      <DataTable
        data={ROLE_ARRAY}
        columns={[
          {
            accessorKey: "label",
            header: "Role",
            cell: ({ row }) => <RoleBadge roleId={row.original.id} />,
          },
          {
            accessorKey: "description",
            header: "Description",
          },
          {
            id: "applications",
            header: "Applications",
            cell: ({ row }) => {
              const applications = getApplicationsByRoleId(row.original.id);

              if (applications.length === 0) return "-";

              return (
                <TooltipProvider>
                  <div className="flex gap-2 flex-wrap">
                    {applications.map((id) => (
                      <Tooltip key={id}>
                        <TooltipTrigger>
                          <ApplicationBadge applicationId={id} />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-sm">
                          {APPLICATION_LIST[id].description}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              );
            },
          },
          {
            id: "user_count",
            header: "Users",
            cell: ({ row }) => {
              const count = query.data ? query.data[row.original.id] : 0;
              return `${count} User${count > 1 ? "s" : ""}`;
            },
          },
        ]}
      />
    </>
  );
}
