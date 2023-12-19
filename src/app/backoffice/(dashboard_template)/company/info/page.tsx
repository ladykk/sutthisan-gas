import { actionQuery } from "@/lib/actions";
import { getCompanyInfo } from "@/server/actions/company";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import CompanyInfoClient from "./client";

export default async function CompanyInfoPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["companyInfo"],
    queryFn: () => actionQuery(getCompanyInfo)(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CompanyInfoClient />
    </HydrationBoundary>
  );
}
