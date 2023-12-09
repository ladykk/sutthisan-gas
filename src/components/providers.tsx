"use client";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster } from "./ui/toaster";

export default function Providers({
  children,
  env,
}: {
  children: ReactNode;
  env: "DEV" | "PRD";
}) {
  const [queryClient, _] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      {env === "DEV" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
