import {
  LayoutHeadContainer,
  LayoutTitle,
} from "@/components/backoffice/theme";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Spinner } from "@/components/ui/spinner";
import { actionQuery } from "@/lib/actions";
import { getRolesUserCount } from "@/server/actions/user";
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
            id: "user_count",
            header: "Users",
            cell: ({ row }) => {
              const count =
                query.data?.find((r) => r.role === row.original.id)?.count ?? 0;
              return `${count} user${count > 1 ? "s" : ""}`;
            },
          },
        ]}
      />
    </>
  );
}
