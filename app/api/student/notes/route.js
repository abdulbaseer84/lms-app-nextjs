import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Note from "@/models/Note";
import { verifyToken } from "@/utils/jwt";

/* -------------------------
   GET — Fetch notes
------------------------- */
export async function GET(request) {
  await dbConnect();

  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);

  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const notes = await Note.find({ studentId: user.id }).sort({ createdAt: -1 });

  return NextResponse.json({ notes });
}

/* -------------------------
   POST — Add Note
------------------------- */
export async function POST(request) {
  await dbConnect();
  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);

  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { text } = await request.json();

  const note = await Note.create({
    studentId: user.id,
    text,
  });

  return NextResponse.json({ note });
}

/* -------------------------
   PUT — Edit Note
------------------------- */
export async function PUT(request) {
  await dbConnect();
  const { id, text } = await request.json();

  const updated = await Note.findByIdAndUpdate(id, { text }, { new: true });

  return NextResponse.json({ updated });
}

/* -------------------------
   DELETE — Delete Note
------------------------- */
export async function DELETE(request) {
  await dbConnect();
  const { id } = await request.json();

  await Note.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}
