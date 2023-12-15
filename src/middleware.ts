import { NextRequest, NextResponse } from "next/server";
import { SBServerClient } from "./server/supabase";
import { cookies } from "next/headers";
import { getAuthErrorUrl } from "./lib/url";

const RESTRICTED_ROUTES = ["/backoffice"];

export async function middleware(req: NextRequest) {
  const session = (await SBServerClient(cookies()).auth.getSession()).data
    .session;

  if (
    !session &&
    RESTRICTED_ROUTES.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(
      new URL(getAuthErrorUrl("NoSession", req.nextUrl.pathname), req.url)
    );
  } else {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-url", req.url);
    requestHeaders.set("x-next-url", req.nextUrl.pathname);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
}
