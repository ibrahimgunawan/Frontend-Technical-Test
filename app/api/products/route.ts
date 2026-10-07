import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { productsData } from "@/lib/products-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  return NextResponse.json(
    { data: productsData },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
