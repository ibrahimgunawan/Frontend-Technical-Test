import { SignJWT, jwtVerify } from "jose";
import type { AuthUser } from "@/types";

export type { AuthUser };

function getJwtSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(user: AuthUser): Promise<string> {
  const secret = getJwtSecretKey();
  return new SignJWT({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id.toString())
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const secret = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      payload &&
      typeof payload === "object" &&
      payload.user &&
      typeof payload.user === "object"
    ) {
      const u = payload.user as Record<string, unknown>;
      if (
        typeof u.id === "number" &&
        typeof u.name === "string" &&
        typeof u.email === "string"
      ) {
        return {
          id: u.id,
          name: u.name,
          email: u.email,
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}
