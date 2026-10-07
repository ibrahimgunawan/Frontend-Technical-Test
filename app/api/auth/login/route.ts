import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validations";
import { DUMMY_USER, COOKIE_NAME, SESSION_COOKIE_OPTIONS, signSession } from "@/lib/auth";
import type { AuthUser } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body" },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  const result = loginSchema.safeParse(body);
  if (!result.success) {
    const formattedErrors = result.error.flatten().fieldErrors;
    return NextResponse.json(
      {
        message: "Validation error",
        errors: formattedErrors,
      },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  const { email, password } = result.data;

  if (email !== DUMMY_USER.email || password !== DUMMY_USER.password) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  const userPayload: AuthUser = {
    id: DUMMY_USER.id,
    name: DUMMY_USER.name,
    email: DUMMY_USER.email,
  };

  const token = await signSession(userPayload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);

  return NextResponse.json(
    {
      message: "Login successful",
      user: userPayload,
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
