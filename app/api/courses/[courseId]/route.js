import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Course from "@/models/Course";
import { verifyToken } from "@/utils/jwt";

export async function GET(request, context) {
  await dbConnect();

  // ⬅️ FIX: params is now a promise
  const { courseId } = await context.params;

  const course = await Course.findById(courseId).populate(
    "instructor",
    "name email"
  );

  if (!course) {
    return NextResponse.json(
      { message: "Course not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ course });
}

export async function PUT(request, { params }) {
  await dbConnect();

  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);
  const data = await request.json();

  const course = await Course.findById(params.courseId);

  if (course.instructor.toString() !== user.id && user.role !== "admin") {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  const updated = await Course.findByIdAndUpdate(params.courseId, data, {
    new: true,
  });

  return NextResponse.json({ message: "Updated", course: updated });
}

export async function DELETE(request, { params }) {
  await dbConnect();

  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);

  const course = await Course.findById(params.courseId);

  if (course.instructor.toString() !== user.id && user.role !== "admin") {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  await Course.findByIdAndDelete(params.courseId);

  return NextResponse.json({ message: "Course deleted" });
}
