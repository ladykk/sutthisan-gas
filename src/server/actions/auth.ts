"use server";
import { zfd } from "zod-form-data";
import {
  IMAGE_MIME_TYPES,
  zodEmail,
  zodFile,
  zodFullName,
  zodPassword,
  zodPhoneNumber,
} from "../zod";
import { z } from "zod";
import { ReturnSafeActionData, action, authAction } from ".";
import { SBServerClient } from "../supabase";
import { cookies } from "next/headers";
import { CURRENT_TIMESTAMP, db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { AVATAR_BUCKET } from "../db/storage";

// Sign In
const signInSchema = zfd.formData({
  email: zfd.text(zodEmail),
  password: zfd.text(zodPassword),
});

export type TSignInSchema = z.infer<typeof signInSchema>;

export const signIn = action(signInSchema, async (inputs) => {
  const supabase = SBServerClient(cookies());
  const { error } = await supabase.auth.signInWithPassword(inputs);
  if (error) throw error;
});

// Sign Out
export const signOut = action(z.void(), async () => {
  const supabase = SBServerClient(cookies());
  await supabase.auth.signOut();
});

// Sign Up
const signUpSchema = zfd
  .formData({
    email: zfd.text(zodEmail),
    password: zfd.text(zodPassword),
    confirmPassword: zfd.text(zodPassword),
    fullName: zfd.text(zodFullName),
    phoneNumber: zfd.text(zodPhoneNumber),
  })
  .superRefine(async (data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    const profile = await db.query.profiles.findFirst({
      where: ({ email }, { eq }) => eq(email, data.email),
    });
    if (profile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email already registered",
        path: ["email"],
      });
    }
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;

export const signUp = action(signUpSchema, async (inputs) => {
  const supabase = SBServerClient(cookies());
  const { data, error } = await supabase.auth.signUp({
    email: inputs.email,
    password: inputs.password,
    options: {
      data: {
        fullName: inputs.fullName,
        phoneNumber: inputs.phoneNumber,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error("User cannot be created.");

  // Update profile
  await db
    .insert(profiles)
    .values({
      id: data.user.id,
      email: inputs.email,
      fullName: inputs.fullName,
      phoneNumber: inputs.phoneNumber,
      createdAt: CURRENT_TIMESTAMP,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        email: inputs.email,
        fullName: inputs.fullName,
        phoneNumber: inputs.phoneNumber,
        createdAt: CURRENT_TIMESTAMP,
      },
    });
});

// Get Session
export const getSession = authAction(z.void(), async (_, ctx) => {
  return ctx.auth;
});

// Get User
export const getUser = authAction(z.void(), async (_, ctx) => {
  const supabase = SBServerClient(cookies());
  const { data } = await supabase.auth.getSession();
  if (!data.session)
    throw new Error("Cannot find session. Please sign in again.");
  const user = await db.query.profiles.findFirst({
    where: ({ id }, { eq }) => eq(id, data?.session?.user.id ?? ""),
  });
  if (!user) throw new Error("Cannot find user.");

  return { ...user, session: ctx.auth };
});

export type TGetUser = ReturnSafeActionData<typeof getUser>;

// Update Profile
const updateProfileSchema = zfd.formData({
  fullName: zfd.text(zodFullName),
  phoneNumber: zfd.text(zodPhoneNumber),
});

export type TUpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export const updateProfile = authAction(
  updateProfileSchema,
  async (inputs, ctx) => {
    // Update profile
    const supabase = SBServerClient(cookies());
    const { error } = await supabase.auth.updateUser({
      data: {
        fullName: inputs.fullName,
        phoneNumber: inputs.phoneNumber,
      },
    });

    // Handle errors
    if (error) throw error;

    // Update profile
    await db
      .update(profiles)
      .set({
        fullName: inputs.fullName,
        phoneNumber: inputs.phoneNumber,
        updatedAt: CURRENT_TIMESTAMP,
      })
      .where(eq(profiles.id, ctx.auth.user.id));
  }
);

// Update Password
const updatePasswordSchema = zfd
  .formData({
    password: zfd.text(zodPassword),
    confirmPassword: zfd.text(zodPassword),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type TUpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

export const updatePassword = authAction(
  updatePasswordSchema,
  async (inputs) => {
    // Update password
    const supabase = SBServerClient(cookies());
    const { error } = await supabase.auth.updateUser({
      password: inputs.password,
    });

    // Handle errors
    if (error) throw error;
  }
);

// Update Avatar
const updateAvatarSchema = zfd.formData({
  avatar: zfd.file(
    zodFile({
      maxSizeMB: 1,
      allowedFileTypes: IMAGE_MIME_TYPES,
    })
      .nullable()
      .default(null)
  ),
});

export type TUpdateAvatarSchema = z.infer<typeof updateAvatarSchema>;

export const updateAvatar = authAction(
  updateAvatarSchema,
  async (inputs, ctx) => {
    // Get previous avatar
    const user = await db.query.profiles.findFirst({
      where: ({ id }, { eq }) => eq(id, ctx.auth.user.id),
    });

    if (!user) throw new Error("Cannot find user.");

    const supabase = SBServerClient(cookies());
    // Remove previous avatar
    if (user.avatarUrl) {
      await supabase.storage.from(AVATAR_BUCKET).remove([user.avatarUrl]);
      await supabase.auth.updateUser({ data: { avatarUrl: null } });
      await db
        .update(profiles)
        .set({ avatarUrl: null })
        .where(eq(profiles.id, user.id));
    }

    // Upload avatar
    if (inputs.avatar) {
      const { data, error } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(`${user.id}/${inputs.avatar.name}`, inputs.avatar);
      if (error) throw error;
      await supabase.auth.updateUser({ data: { avatarUrl: data.path } });
      await db
        .update(profiles)
        .set({ avatarUrl: data.path })
        .where(eq(profiles.id, user.id));
    }
  }
);
