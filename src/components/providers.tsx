"use client";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./ui/toaster";

export default function Providers({
  children,
  env,
}: {
  children: ReactNode;
  env: "DEV" | "PRD";
}) {
  const [queryClient, _] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      {env === "DEV" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
