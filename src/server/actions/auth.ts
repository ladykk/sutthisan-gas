import { z } from "zod";
import { SBServerClient } from "../supabase";
import { cookies } from "next/headers";
import {
  ActionInternalServerError,
  ActionSuccess,
  ActionUnauthorizedError,
  ActionValidationError,
  TActionResponse,
} from ".";
import { zodEmail, zodFullName, zodPassword, zodPhoneNumber } from "../zod";
import { CURRENT_TIMESTAMP, db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { IMAGE_MIME_TYPES, checkFileRequirements } from "../form";

const signInSchema = z.object({
  email: zodEmail,
  password: zodPassword,
});

export type TSignInSchema = z.infer<typeof signInSchema>;

export async function signIn(
  inputs: TSignInSchema
): Promise<TActionResponse<undefined, TSignInSchema>> {
  "use server";
  // Validate inputs
  const validation = signInSchema.safeParse(inputs);
  if (!validation.success) return ActionValidationError(validation.error);

  // Sign in with Supabase
  const supabase = SBServerClient(cookies());
  const { error } = await supabase.auth.signInWithPassword(validation.data);

  // Handle errors
  if (error) return ActionUnauthorizedError(error.message);

  // Return success
  return ActionSuccess();
}

export type TSignInFn = typeof signIn;

const signUpSchema = z.object({
  email: zodEmail,
  password: zodPassword,
  confirmPassword: zodPassword,
  fullName: zodFullName,
  phoneNumber: zodPhoneNumber,
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export async function signUp(
  inputs: TSignUpSchema
): Promise<TActionResponse<undefined, TSignUpSchema>> {
  "use server";
  // Validate inputs
  const validation = signUpSchema.safeParse(inputs);
  if (!validation.success) return ActionValidationError(validation.error);

  // Check if passwords match
  if (validation.data.password !== validation.data.confirmPassword)
    return ActionValidationError([
      {
        path: "confirmPassword",
        message: "Passwords do not match",
      },
    ]);

  // Sign up with Supabase
  const supabase = SBServerClient(cookies());
  const { data, error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        fullName: validation.data.fullName,
        phoneNumber: validation.data.phoneNumber,
      },
    },
  });

  // Handle errors
  if (error?.message === "User already registered")
    return ActionUnauthorizedError(error.message);
  if (!data.user || error)
    return ActionInternalServerError(
      error?.message ?? "User cannot be created."
    );

  // Update profile
  await db
    .insert(profiles)
    .values({
      id: data.user.id,
      email: validation.data.email,
      fullName: validation.data.fullName,
      phoneNumber: validation.data.phoneNumber,
      createdAt: CURRENT_TIMESTAMP,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        email: validation.data.email,
        fullName: validation.data.fullName,
        phoneNumber: validation.data.phoneNumber,
        createdAt: CURRENT_TIMESTAMP,
      },
    });

  // Return success
  return ActionSuccess();
}

export type TSignUpFn = typeof signUp;

export async function getSession(options?: { isFormatted?: boolean }) {
  "use server";
  const { isFormatted = true } = options || {};

  const supabase = SBServerClient(cookies());
  const { data } = await supabase.auth.getSession();
  if (!data.session)
    return {
      session: null,
      user: null,
    };
  let user = await db.query.profiles.findFirst({
    where: ({ id }, { eq }) => eq(id, data?.session?.user.id ?? ""),
  });
  if (!user) return { session: null, user: null };
  if (isFormatted) {
    user.avatarUrl = user?.avatarUrl
      ? supabase.storage.from("avatars").getPublicUrl(user.avatarUrl).data
          .publicUrl
      : null;
  }
  return { session: data.session, user };
}

export type TGetSession = Awaited<ReturnType<typeof getSession>>;

export async function signOut() {
  "use server";
  const supabase = SBServerClient(cookies());
  await supabase.auth.signOut();
  return ActionSuccess();
}

export type TSignOutFn = typeof signOut;

const updateProfileSchema = z.object({
  fullName: zodFullName,
  phoneNumber: zodPhoneNumber,
});

export type TUpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export async function updateProfile(
  inputs: z.infer<typeof updateProfileSchema>
): Promise<TActionResponse<undefined, z.infer<typeof updateProfileSchema>>> {
  "use server";
  // Validate inputs
  const validation = updateProfileSchema.safeParse(inputs);
  if (!validation.success) return ActionValidationError(validation.error);

  // Get session
  const { session, user } = await getSession();
  if (!session || !user) return ActionUnauthorizedError();

  // Update profile
  const supabase = SBServerClient(cookies());
  const { error } = await supabase.auth.updateUser({
    data: {
      fullName: validation.data.fullName,
      phoneNumber: validation.data.phoneNumber,
    },
  });

  // Handle errors
  if (error)
    return ActionInternalServerError(
      error?.message ?? "User cannot be updated."
    );

  // Update profile
  await db
    .update(profiles)
    .set({
      fullName: validation.data.fullName,
      phoneNumber: validation.data.phoneNumber,
      updatedAt: CURRENT_TIMESTAMP,
    })
    .where(eq(profiles.id, user.id));

  // Return success
  return ActionSuccess();
}
export type TUpdateProfileFn = typeof updateProfile;

const updatePasswordSchema = z.object({
  password: zodPassword,
  confirmPassword: zodPassword,
});

export type TUpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

export const updatePassword = async (
  inputs: z.infer<typeof updatePasswordSchema>
): Promise<
  TActionResponse<undefined, z.infer<typeof updatePasswordSchema>>
> => {
  "use server";
  // Validate inputs
  const validation = updatePasswordSchema.safeParse(inputs);
  if (!validation.success) return ActionValidationError(validation.error);

  // Check if passwords match
  if (validation.data.password !== validation.data.confirmPassword)
    return ActionValidationError([
      {
        path: "confirmPassword",
        message: "Passwords do not match",
      },
    ]);

  // Get session
  const { session } = await getSession();
  if (!session) return ActionUnauthorizedError();

  // Update password
  const supabase = SBServerClient(cookies());
  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  // Handle errors
  if (error)
    if (
      error.message ===
      "New password should be different from the old password."
    )
      return ActionValidationError([
        {
          path: "password",
          message: error.message,
        },
      ]);
    else
      return ActionInternalServerError(
        error?.message ?? "Password cannot be updated."
      );

  // Return success
  return ActionSuccess();
};
export type TUpdatePasswordFn = typeof updatePassword;

export type TUpdateAvatarSchema = {
  avatar: File | null;
};

export const updateAvatar = async (formData: FormData) => {
  "use server";
  // Get avatar
  const avatar = formData.get("avatar") as File | null;

  // Check if avatar is valid
  if (avatar) {
    const { isValid, errors } = checkFileRequirements(avatar, {
      maxSizeMB: 1,
      allowedFileTypes: IMAGE_MIME_TYPES,
    });
    if (!isValid)
      return ActionValidationError([
        {
          path: "avatar",
          message: errors.join(", "),
        },
      ]);
  }

  // Get session
  const { session, user } = await getSession({ isFormatted: false });
  if (!session || !user) return ActionUnauthorizedError();

  const supabase = SBServerClient(cookies());
  // Remove previous avatar
  if (user.avatarUrl) {
    await supabase.storage.from("avatars").remove([user.avatarUrl]);
    await supabase.auth.updateUser({ data: { avatarUrl: null } });
    await db
      .update(profiles)
      .set({ avatarUrl: null })
      .where(eq(profiles.id, user.id));
  }

  // Upload avatar
  if (avatar) {
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`${user.id}/${avatar.name}`, avatar);
    if (error)
      return ActionInternalServerError(
        error?.message ?? "Avatar cannot be uploaded."
      );
    await supabase.auth.updateUser({ data: { avatarUrl: data.path } });
    await db
      .update(profiles)
      .set({ avatarUrl: data.path })
      .where(eq(profiles.id, user.id));
  }

  // Return success
  return ActionSuccess();
};

export type TUpdateAvatarFn = typeof updateAvatar;
