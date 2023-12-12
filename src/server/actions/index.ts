import { createSafeActionClient } from "next-safe-action";
import { AuthError } from "@supabase/supabase-js";
import { SBServerClient } from "../supabase";
import { cookies } from "next/headers";

// Error handling
function handleReturnedServerError(error: Error) {
  if (error instanceof AuthError)
    return {
      serverError: error.message,
    };
  else {
    return {
      serverError: "Something went wrong.",
    };
  }
}

// Middleware
async function authMiddleware() {
  const supabase = SBServerClient(cookies());
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("Unauthorized.");
  else return data.session;
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
