import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/utils/jwt";
import AssignedCourse from "@/models/AssignedCourse";
import Course from "@/models/Course";

export async function GET(request) {
  await dbConnect();

  // Read token
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ courses: [] }, { status: 401 });
  }

  const user = verifyToken(token); // {id, role, name}

  // Fetch assigned courses
  const assigned = await AssignedCourse.find({ student: user.id }).populate("course");

  // Extract course data
  const courseList = assigned.map((item) => item.course);

  return NextResponse.json({
    courses: courseList,
  });
}
