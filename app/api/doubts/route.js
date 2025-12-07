import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Doubt from "@/models/Doubt";
import User from "@/models/User";
import { verifyToken } from "@/utils/jwt";

export async function GET() {
  try {
    await dbConnect();

    const doubts = await Doubt.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name")
      .populate("replies.userId", "name");

    return NextResponse.json({ doubts });
  } catch (err) {
    console.error("GET doubts error:", err);
    return NextResponse.json({ doubts: [] });
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

    const doubt = await Doubt.create({
      userId: user.id,
      text,
    });

    return NextResponse.json({ doubt });
  } catch (err) {
    console.error("POST doubt error:", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();

    const token = request.cookies.get("token")?.value;
    const user = verifyToken(token);

    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { doubtId, text } = await request.json();

    const reply = {
      userId: user.id,
      text,
    };

    const updated = await Doubt.findByIdAndUpdate(
      doubtId,
      { $push: { replies: reply } },
      { new: true }
    );

    return NextResponse.json({ updated });
  } catch (err) {
    console.error("PUT doubt reply error:", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
