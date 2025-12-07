import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const user = verifyToken(token); // {id, name, role}

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}
