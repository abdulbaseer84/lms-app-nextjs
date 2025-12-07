import { NextResponse } from "next/server";
import Lesson from "@/models/Lesson";
import Course from "@/models/Course";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/utils/jwt";

export async function PUT(request, { params }) {
  await dbConnect();

  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);

  const course = await Course.findById(params.courseId);

  if (!course || (course.instructor.toString() !== user.id && user.role !== "admin"))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const data = await request.json();

  const lesson = await Lesson.findByIdAndUpdate(params.lessonId, data, {
    new: true,
  });

  return NextResponse.json({ message: "Lesson updated", lesson });
}

export async function DELETE(request, { params }) {
  await dbConnect();

  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);

  const course = await Course.findById(params.courseId);

  if (!course || (course.instructor.toString() !== user.id && user.role !== "admin"))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  await Lesson.findByIdAndDelete(params.lessonId);

  return NextResponse.json({ message: "Lesson deleted" });
}
