import { getCallbackUrl } from "@/lib/headers";
import { getAuthErrorUrl } from "@/lib/url";
import { getSession } from "@/server/actions/auth";
import { checkRole } from "@/server/actions/user";
import { APPLICATION_LIST } from "@/static/application";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function BackOfficeLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession()
    .then((res) => res.data)
    .catch(() => undefined);

  if (!session) return redirect(getAuthErrorUrl("NoSession", getCallbackUrl()));

  const role = await checkRole(APPLICATION_LIST.BackOffice.roles)
    .then((res) => res.data)
    .catch(() => false);

  if (!role) return redirect(getAuthErrorUrl("NoPermission", getCallbackUrl()));

  return <>{children}</>;
}
