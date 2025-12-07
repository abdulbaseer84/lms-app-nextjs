import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Lesson from "@/models/Lesson";
import Course from "@/models/Course";
import { verifyToken } from "@/utils/jwt";

export async function POST(request, { params }) {
  await dbConnect();

  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);

  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  const { title, content, videoUrl, position } = await request.json();

  const course = await Course.findById(params.courseId);

  if (!course) return NextResponse.json({ message: "Course not found" });

  // Only course instructor can add lessons
  if (course.instructor.toString() !== user.id && user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const lesson = await Lesson.create({
    course: params.courseId,
    title,
    content,
    videoUrl,
    position,
  });

  return NextResponse.json({ message: "Lesson added", lesson });
}

export async function GET(request, { params }) {
  await dbConnect();

  const lessons = await Lesson.find({ course: params.courseId }).sort("position");

  return NextResponse.json({ lessons });
}
