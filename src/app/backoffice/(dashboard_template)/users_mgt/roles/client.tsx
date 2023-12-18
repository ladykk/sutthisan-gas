import {
  LayoutHeadContainer,
  LayoutTitle,
} from "@/components/backoffice/theme";
import { Badge } from "@/components/ui/badge";
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
import { ROLE_ARRAY } from "@/static/auth";
import { useQuery } from "@tanstack/react-query";

export default function BackofficeUsersMgtRolesClient() {
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
            cell: ({ row }) => (
              <Badge style={{ backgroundColor: row.original.colorCode }}>
                {row.original.label}
              </Badge>
            ),
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
                  <div className="flex gap-3 flex-wrap">
                    {applications.map((id) => (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            key={id}
                            style={{
                              backgroundColor: APPLICATION_LIST[id].colorCode,
                            }}
                          >
                            {APPLICATION_LIST[id].label}
                          </Badge>
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
              return `${count} user${count > 1 ? "s" : ""}`;
            },
          },
        ]}
      />
    </>
  );
}
