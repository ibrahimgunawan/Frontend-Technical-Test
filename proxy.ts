import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/jwt";

const COOKIE_NAME = "session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/\.(png|jpg|jpeg|webp|svg|ico|gif)$/i.test(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifySessionToken(token) : null;

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/products",
    "/products/((?!.*\\.[\\w]+$).*)",
  ],
};
