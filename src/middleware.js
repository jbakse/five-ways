import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/questions/:path*", "/surveys/:path*", "/responses/:path*"],
};

export function middleware(request) {
  const basicAuth = request.headers.get("authorization");
  const url = request.nextUrl;

  console.log("url:" + new URL(request.url).pathname);
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === "walkerart" && pwd === "FiveWaysNoMore") {
      return NextResponse.next();
    }
  }

  url.pathname = "/api/auth";
  return NextResponse.rewrite(url);
}
