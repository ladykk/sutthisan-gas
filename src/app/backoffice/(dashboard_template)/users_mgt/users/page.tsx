import {
  LayoutHeadContainer,
  LayoutTitle,
} from "@/components/backoffice/theme";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import BackofficeUserMgtUsersClient from "./client";
import { getPaginateUsers } from "@/server/actions/user";
import { actionQuery } from "@/lib/actions";

type Props = {
  searchParams: {
    page: number;
    itemsPerPage: number;
    search: string;
  };
};

export default async function BackofficeUserMgtUsersPage({
  searchParams,
}: Props) {
  const page = searchParams.page ?? 1;
  const itemsPerPage = searchParams.itemsPerPage ?? 10;
  const search = searchParams.search ?? "";

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [
      "users",
      `page:${page}`,
      `itemsPerPage:${itemsPerPage}`,
      `search:${search}`,
    ],
    queryFn: () =>
      actionQuery(getPaginateUsers)({
        search,
        page,
        itemsPerPage,
      }),
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BackofficeUserMgtUsersClient />
      </HydrationBoundary>
    </>
  );
}
