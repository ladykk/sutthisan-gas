import { env } from "@/env.mjs";
import { getUser } from "@/server/actions/auth";
import { BackButton } from "@/components/common/action-button";
import {
  ProfileAvatarForm,
  ProfileChangePasswordForm,
  ProfileInfoForm,
} from "./client";

import { getAuthErrorUrl } from "@/lib/url";
import { getCallbackUrl } from "@/lib/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: `Manage Profile | ${env.NEXT_PUBLIC_ORGANIZATION_NAME}`,
};

export default async function ProfilePage() {
  const user = await getUser();

  if (!user.data)
    return redirect(getAuthErrorUrl("NoSession", getCallbackUrl()));

  return (
    <div className="bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 items-center w-full sticky left-0 top-0 right-0 bg-muted p-5 z-50">
          <BackButton />
          <h1 className="text-3xl font-bold text-primary">Manage Profile</h1>
        </div>
        <div className="flex flex-col px-5 pb-5 gap-5 lg:flex-row">
          <div className="flex-1">
            <ProfileInfoForm user={user.data} />
          </div>

          <div className="space-y-5 flex-1">
            <ProfileAvatarForm user={user.data} />
            <ProfileChangePasswordForm user={user.data} />
          </div>
        </div>
      </div>
    </div>
  );
}
