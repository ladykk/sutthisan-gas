import { LayoutBackOffice } from "@/components/backoffice/theme";
import { env } from "@/env.mjs";
import { getUser } from "@/server/actions/auth";
import { ReactNode } from "react";

export default async function BackofficeDashboardTemplate({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  if (!user.data) return;

  return (
    <LayoutBackOffice
      user={user.data}
      ORGANIZATION_NAME={env.NEXT_PUBLIC_ORGANIZATION_NAME}
    >
      {children}
    </LayoutBackOffice>
  );
}
