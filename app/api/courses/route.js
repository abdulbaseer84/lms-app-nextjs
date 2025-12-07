import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Course from "@/models/Course";
import { verifyToken } from "@/utils/jwt";

export async function POST(request) {
  await dbConnect();

  const token = request.cookies.get("token")?.value;
  const user = verifyToken(token);

  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  const data = await request.json();

  const course = await Course.create({
    ...data,
    instructor: user.id,
  });

  return NextResponse.json({ message: "Course created", course });
}

export async function GET() {
  await dbConnect();

  const courses = await Course.find().populate("instructor", "name email");

  return NextResponse.json({ courses });
}
