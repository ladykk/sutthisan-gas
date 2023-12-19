import BackofficeUsersMgtRolesClient from "./client";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getRolesUserCount } from "@/server/actions/user";
import { actionQuery } from "@/lib/actions";

export default async function BackofficeUsersMgtRolesPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["rolesUserCount"],
    queryFn: () => actionQuery(getRolesUserCount)(),
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BackofficeUsersMgtRolesClient />
      </HydrationBoundary>
    </>
  );
}
