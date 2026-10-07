import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      {
        authenticated: false,
        message: "Unauthorized",
      },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      user,
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
