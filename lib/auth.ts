import { cookies } from "next/headers";
import type { AuthUser } from "@/types";
import { signSessionToken, verifySessionToken } from "./jwt";

export type { AuthUser };

export const DUMMY_USER = {
  id: 1,
  name: "Intern User",
  email: "intern@example.com",
  password: "intern123",
};

export const COOKIE_NAME = "session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24, 
};

export async function signSession(user: AuthUser): Promise<string> {
  return signSessionToken(user);
}

export async function verifySession(token: string): Promise<AuthUser | null> {
  return verifySessionToken(token);
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) {
    return null;
  }
  return verifySessionToken(sessionToken);
}
