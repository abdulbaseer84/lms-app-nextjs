import { NextResponse } from "next/server";
import Lesson from "@/models/Lesson";
import { dbConnect } from "@/lib/dbConnect";

/* GET ALL LESSONS */
export async function GET(request) {
  await dbConnect();

  const courseId = request.nextUrl.searchParams.get("courseId");
  const lessons = await Lesson.find({ courseId });

  return NextResponse.json({ lessons });
}

/* CREATE LESSON */
export async function POST(request) {
  await dbConnect();

  const data = await request.json();

  const lesson = await Lesson.create({
    courseId: data.courseId,
    title: data.title,
    videoUrl: data.videoUrl || "",
    duration: data.duration || "",
    description: data.description || "",
    subtopics: Array.isArray(data.subtopics)
      ? data.subtopics.map((s) =>
          typeof s === "string" ? { title: s, videoUrl: "" } : s
        )
      : [],
  });

  return NextResponse.json({ lesson });
}

/* UPDATE LESSON */
export async function PUT(request) {
  await dbConnect();

  let body = await request.json();

  // convert string → object if needed
  if (Array.isArray(body.subtopics)) {
    body.subtopics = body.subtopics.map((s) =>
      typeof s === "string" ? { title: s, videoUrl: "" } : s
    );
  }

  const updated = await Lesson.findByIdAndUpdate(body._id, body, {
    new: true,
  });

  return NextResponse.json({ lesson: updated });
}

/* DELETE LESSON */
export async function DELETE(request) {
  await dbConnect();

  const body = await request.json();
  await Lesson.findByIdAndDelete(body.id);

  return NextResponse.json({ message: "Lesson deleted" });
}
