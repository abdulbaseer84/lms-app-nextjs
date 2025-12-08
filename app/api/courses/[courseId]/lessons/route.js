import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Lesson from "@/models/Lesson";
import Course from "@/models/Course";
import { verifyToken } from "@/utils/jwt";

// -----------------------------------------------------
// ADD LESSON
// -----------------------------------------------------
export async function POST(request, context) {
  await dbConnect();

  const { courseId } = await context.params; // FIXED

  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);

  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  const { title, videoUrl, duration, description, subtopics } =
    await request.json();

  const course = await Course.findById(courseId);
  if (!course) return NextResponse.json({ message: "Course not found" });

  // Only instructor OR admin
  if (course.instructor.toString() !== user.id && user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const lesson = await Lesson.create({
    courseId,
    title,
    videoUrl,
    duration,
    description,
    subtopics: subtopics || [],
  });

  return NextResponse.json({ message: "Lesson added", lesson });
}

// -----------------------------------------------------
// GET ALL LESSONS
// -----------------------------------------------------
export async function GET(request, context) {
  await dbConnect();

  const { courseId } = await context.params; // FIXED

  const lessons = await Lesson.find({ courseId }).sort("createdAt");

  return NextResponse.json({ lessons });
}
