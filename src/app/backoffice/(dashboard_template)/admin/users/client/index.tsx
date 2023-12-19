"use client";

import {
  LayoutHeadContainer,
  LayoutTitle,
} from "@/components/common/theme/dashboard";
import { AuthAvatar } from "@/components/common/auth";
import {
  DataTable,
  DataTableDate,
  DataTablePagination,
} from "@/components/ui/data-table";
import { Spinner } from "@/components/ui/spinner";
import { actionQuery } from "@/lib/actions";
import { useSearchParams } from "@/lib/url";
import { formatPhoneNumber } from "@/lib/utils";
import { getPaginateUsers } from "@/server/actions/user";
import { useQuery } from "@tanstack/react-query";
import { UserRoleManagement } from "./role";
import { SearchSection } from "./filters";

export default function UserClient() {
  const searchParams = useSearchParams({
    page: 1,
    itemsPerPage: 10,
    search: "",
  });

  const query = useQuery({
    queryKey: [
      "users",
      `page:${searchParams.get("page")}`,
      `itemsPerPage:${searchParams.get("itemsPerPage")}`,
      `search:${searchParams.get("search")}`,
    ],
    queryFn: () =>
      actionQuery(getPaginateUsers)({
        search: searchParams.get("search"),
        page: searchParams.get("page"),
        itemsPerPage: searchParams.get("itemsPerPage"),
      }),
  });

  return (
    <>
      <LayoutHeadContainer
        left={
          <>
            <LayoutTitle>Users</LayoutTitle>
            {query.isFetching && <Spinner />}
          </>
        }
        right={
          <>
            <SearchSection />
          </>
        }
      />
      <DataTable
        data={query.data?.list}
        columns={[
          {
            accessorKey: "avatarUrl",
            header: "Avatar",
            cell: ({ row }) => (
              <AuthAvatar
                src={row.original.avatarUrl}
                fullName={row.original.fullName}
                className="h-14 w-14"
              />
            ),
          },
          {
            accessorKey: "email",
            header: "Email",
          },
          {
            accessorKey: "fullName",
            header: "Full Name",
          },
          {
            accessorKey: "phoneNumber",
            header: "Phone Number",
            cell: ({ row }) => formatPhoneNumber(row.original.phoneNumber),
          },
          {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => (
              <DataTableDate
                value={row.original.createdAt}
                display="datetime"
              />
            ),
          },
          {
            accessorKey: "updatedAt",
            header: "Updated At",
            cell: ({ row }) => (
              <DataTableDate
                value={row.original.updatedAt}
                display="datetime"
              />
            ),
          },
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <div className="space-x-3">
                <UserRoleManagement user={row.original} />
              </div>
            ),
          },
        ]}
      />
      <DataTablePagination
        className="mt-4"
        count={query.data?.count}
        currentPage={query.data?.currentPage}
        itemsPerPage={query.data?.itemsPerPage}
        totalPages={query.data?.totalPages}
        onPageChange={(page) => searchParams.set("page", page)}
        onItemsPerPageChange={(itemsPerPage) =>
          searchParams.set("itemsPerPage", itemsPerPage)
        }
      />
    </>
  );
}
