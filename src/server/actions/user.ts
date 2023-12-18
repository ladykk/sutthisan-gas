"use server";
import { z } from "zod";
import {
  PaginationData,
  ReturnSafeActionData,
  authAction,
  roleAction,
  roleMiddleware,
} from ".";
import { Roles, ROLE_ID_ARRAY, TRoleId } from "@/static/auth";
import { db } from "../db";
import { desc, like, or, sql } from "drizzle-orm";
import { profiles, userRoles } from "../db/schema";
import { zfd } from "zod-form-data";
import { grantRole, revokeRole } from "../functions/user";

// Get Paginate Users
const getUsersSchema = z.object({
  search: z.string().optional().default(""),
  page: z.number().optional().default(1),
  itemsPerPage: z.number().optional().default(10),
});
export const getPaginateUsers = roleAction([Roles.Administrator])(
  getUsersSchema,
  async (input) => {
    const count = await db
      .select({
        count: sql<number>`cast(count(${profiles.id}) as int)`,
      })
      .from(profiles)
      .where(
        or(
          like(profiles.fullName, `%${input.search}%`),
          like(profiles.email, `%${input.search}%`),
          like(profiles.phoneNumber, `%${input.search}%`)
        )
      );

    const users = await db
      .select()
      .from(profiles)
      .where(
        or(
          like(profiles.fullName, `%${input.search}%`),
          like(profiles.email, `%${input.search}%`),
          like(profiles.phoneNumber, `%${input.search}%`)
        )
      )
      .orderBy(desc(profiles.createdAt))
      .limit(input.itemsPerPage)
      .offset((input.page - 1) * input.itemsPerPage);

    return {
      list: users,
      count: count[0].count,
      currentPage: input.page,
      totalPages: Math.ceil(count[0].count / input.itemsPerPage),
      itemsPerPage: input.itemsPerPage,
    } satisfies PaginationData<(typeof users)[0]>;
  }
);

export type TGetUsers = ReturnSafeActionData<typeof getPaginateUsers>;

// Get User's Roles
const getUserRolesSchema = z
  .string({
    required_error: "User id is required",
  })
  .refine(
    async (userId) => {
      const user = await db.query.profiles.findFirst({
        columns: {
          id: true,
        },
        where: ({ id }, { eq }) => eq(id, userId),
      });
      return !!user;
    },
    {
      message: "User not found",
    }
  );

export const getUserRoles = roleAction([Roles.Administrator])(
  getUserRolesSchema,
  async (input) => {
    const roles = await db.query.userRoles.findMany({
      where: ({ userId }, { eq }) => eq(userId, input),
    });
    return roles.map((role) => role.role);
  }
);
export type TGetUserRoles = ReturnSafeActionData<typeof getUserRoles>;

// Grant Role for Backoffice
const grantRoleBackofficeSchema = zfd.formData({
  userId: zfd.text(
    z.string({
      required_error: "User id is required",
    })
  ),
  role: zfd.text(z.enum(ROLE_ID_ARRAY)),
});

export type TGrantRoleBackofficeSchema = z.infer<
  typeof grantRoleBackofficeSchema
>;

export const grantRoleBackoffice = roleAction([Roles.Administrator])(
  grantRoleBackofficeSchema,
  async (input) => {
    const result = await grantRole(input.userId, input.role);
    if (result) return;
    else throw new Error("Cannot grant role");
  }
);

// Revok Role for Backoffice
const revokeRoleBackofficeSchema = zfd.formData({
  userId: zfd.text(
    z.string({
      required_error: "User id is required",
    })
  ),
  role: zfd.text(z.enum(ROLE_ID_ARRAY)),
});

export type TRevokeRoleBackofficeSchema = z.infer<
  typeof revokeRoleBackofficeSchema
>;

export const revokeRoleBackoffice = roleAction([Roles.Administrator])(
  revokeRoleBackofficeSchema,
  async (input) => {
    const result = await revokeRole(input.userId, input.role);
    if (result) return;
    else throw new Error("Cannot revoke role");
  }
);

// Check Role
const checkRoleSchema = z.array(z.enum(ROLE_ID_ARRAY));

export type TCheckRoleSchema = z.infer<typeof checkRoleSchema>;

export const checkRole = authAction(checkRoleSchema, async (input, ctx) => {
  const role = await roleMiddleware(input, ctx.auth.user.id);
  return !!role;
});

// Get Roles' User count
export const getRolesUserCount = roleAction([Roles.Administrator])(
  z.void(),
  async (input) => {
    const result = await db
      .select({
        role: userRoles.role,
        count: sql<number>`cast(count(${userRoles.userId}) as int)`,
      })
      .from(userRoles)
      .groupBy(userRoles.role);

    return ROLE_ID_ARRAY.reduce((acc, roleId) => {
      const role = result.find((role) => role.role === roleId);
      acc[roleId] = role ? role.count : 0;
      return acc;
    }, {} as Record<TRoleId, number>);
  }
);
