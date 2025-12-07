import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Discussion from "@/models/Discussion";
import { verifyToken } from "@/utils/jwt";

export async function POST(request) {
  try {
    await dbConnect();

    const token = request.cookies.get("token")?.value;
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { discussionId, text } = await request.json();

    const reply = { userId: user.id, text };

    await Discussion.findByIdAndUpdate(discussionId, {
      $push: { replies: reply },
    });

    return NextResponse.json({ message: "Reply added" });
  } catch (err) {
    console.error("POST reply error:", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();

    const { discussionId, replyId } = await request.json();

    await Discussion.findByIdAndUpdate(discussionId, {
      $pull: { replies: { _id: replyId } },
    });

    return NextResponse.json({ message: "Reply deleted" });
  } catch (err) {
    console.error("DELETE reply error:", err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
