import { env } from "@/env.mjs";
import {
  getSession,
  updateAvatar,
  updatePassword,
  updateProfile,
} from "@/server/actions/auth";
import { BackButton } from "@/components/common/action-button";
import {
  ProfileAvatarForm,
  ProfileChangePasswordForm,
  ProfileInfoForm,
} from "./client";

export const metadata = {
  title: `Manage Profile | ${env.NEXT_PUBLIC_ORGANIZATION_NAME}`,
};

export default async function ProfilePage() {
  const session = await getSession();
  return (
    <div className="bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-3 items-center w-full sticky left-0 top-0 right-0 bg-muted p-5 z-50">
          <BackButton />
          <h1 className="text-3xl font-bold text-primary">Manage Profile</h1>
        </div>
        <div className="flex flex-col px-5 pb-5 gap-5 lg:flex-row">
          <div className="flex-1">
            <ProfileInfoForm mutationFn={updateProfile} session={session} />
          </div>

          <div className="space-y-5 flex-1">
            <ProfileAvatarForm mutationFn={updateAvatar} session={session} />
            <ProfileChangePasswordForm
              mutationFn={updatePassword}
              session={session}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
