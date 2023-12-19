import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import UserClient from "./client";
import { getPaginateUsers } from "@/server/actions/user";
import { actionQuery } from "@/lib/actions";

type Props = {
  searchParams: {
    page: number;
    itemsPerPage: number;
    search: string;
  };
};

export default async function UserPage({ searchParams }: Props) {
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
        <UserClient />
      </HydrationBoundary>
    </>
  );
}
