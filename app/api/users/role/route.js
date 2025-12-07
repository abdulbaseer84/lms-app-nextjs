import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/utils/jwt";

export async function POST(request) {
  await dbConnect();

  const token = request.cookies.get("token")?.value;
  const admin = verifyToken(token);

  if (!admin || admin.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403 });
  }

  const { userId, role } = await request.json();

  const updated = await User.findByIdAndUpdate(userId, { role }, { new: true });

  return NextResponse.json({
    message: "Role updated",
    user: updated,
  });
}
