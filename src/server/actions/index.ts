import { SafeAction, createSafeActionClient } from "next-safe-action";
import { SBServerClient } from "../supabase";
import { cookies } from "next/headers";
import { TRoleId } from "@/static/role";
import { db } from "../db";

export type ReturnSafeActionData<T extends SafeAction<any, any>> = NonNullable<
  Awaited<ReturnType<T>>["data"]
>;

export type PaginationData<T> = {
  list: T[];
  count: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
};

// Error handling
function handleReturnedServerError(error: Error) {
  return {
    serverError: error.message ?? "Something went wrong.",
  };
}

// Middleware
export async function authMiddleware() {
  const supabase = SBServerClient(cookies());
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("Unauthorized.");
  else return data.session;
}

export async function roleMiddleware(roleIds: TRoleId[], authUserId: string) {
  const role = await db.query.userRoles.findFirst({
    where: ({ userId, role }, { and, eq, inArray }) =>
      and(eq(userId, authUserId), inArray(role, roleIds)),
  });
  return role;
}

// Action
export const action = createSafeActionClient({
  handleReturnedServerError,
});

export const authAction = createSafeActionClient({
  handleReturnedServerError,
  middleware: async () => {
    return { auth: await authMiddleware() };
  },
});

export const roleAction = (roleIds: TRoleId[]) =>
  createSafeActionClient({
    handleReturnedServerError,
    middleware: async () => {
      const auth = await authMiddleware();
      const role = await roleMiddleware(roleIds, auth.user.id);
      if (!role) throw new Error("Unauthorized.");
      return {
        auth,
        role,
      };
    },
  });
