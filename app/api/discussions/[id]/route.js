import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Discussion from "@/models/Discussion";
import { verifyToken } from "@/utils/jwt";

export async function POST(request) {
  await dbConnect();

  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { discussionId, text } = await request.json();

  if (!text) {
    return NextResponse.json(
      { message: "Reply text required" },
      { status: 400 }
    );
  }

  const discussion = await Discussion.findById(discussionId);

  if (!discussion) {
    return NextResponse.json(
      { message: "Discussion not found" },
      { status: 404 }
    );
  }

  discussion.replies.push({
    userId: user.id,
    text,
  });

  await discussion.save();

  return NextResponse.json({ message: "Reply added" });
}

export async function DELETE(request) {
  await dbConnect();

  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { discussionId, replyId } = await request.json();

  const discussion = await Discussion.findById(discussionId);

  if (!discussion) {
    return NextResponse.json(
      { message: "Discussion not found" },
      { status: 404 }
    );
  }

  const reply = discussion.replies.id(replyId);

  if (!reply) {
    return NextResponse.json(
      { message: "Reply not found" },
      { status: 404 }
    );
  }

  // only reply owner or admin can delete
  if (reply.userId.toString() !== user.id && user.role !== "admin") {
    return NextResponse.json(
      { message: "Not allowed" },
      { status: 403 }
    );
  }

  reply.deleteOne();
  await discussion.save();

  return NextResponse.json({ message: "Reply deleted" });
}
