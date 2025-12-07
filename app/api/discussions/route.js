import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Discussion from "@/models/Discussion";
import User from "@/models/User";     // ✅ FIX ADDED
import { verifyToken } from "@/utils/jwt";

export async function GET() {
  try {
    await dbConnect();

    const discussions = await Discussion.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name")
      .populate("replies.userId", "name");

    return NextResponse.json({ discussions });
  } catch (err) {
    console.error("GET discussions error:", err);
    return NextResponse.json({ discussions: [] });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const token = request.cookies.get("token")?.value;
    const user = verifyToken(token);

    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { text } = await request.json();

    const post = await Discussion.create({
      userId: user.id,
      text,
    });

    return NextResponse.json({ post });
  } catch (err) {
    console.error("POST discussion error:", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    const { id } = await request.json();
    await Discussion.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE discussion error:", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
