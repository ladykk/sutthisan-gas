import { TRoleId } from "@/static/auth";
import { db } from "../db";
import { userRoles } from "../db/schema";
import { and, eq } from "drizzle-orm";

// Grant Role
export const grantRole = async (userId: string, role: TRoleId) => {
  return db
    .insert(userRoles)
    .values({
      userId,
      role,
    })
    .onConflictDoNothing()
    .then(() => true)
    .catch(() => false);
};

// Revoke Role
export const revokeRole = async (userId: string, role: TRoleId) => {
  return db
    .delete(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.role, role)))
    .then(() => true)
    .catch(() => false);
};
