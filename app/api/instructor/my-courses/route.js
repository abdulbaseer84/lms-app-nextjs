import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Course from "@/models/Course";

export async function GET(request) {
  await dbConnect();

  try {
    const instructorId = request.headers.get("x-user-id");

    if (!instructorId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized instructor" },
        { status: 401 }
      );
    }

    const courses = await Course.find({ instructor: instructorId });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("INSTRUCTOR GET Courses Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load courses" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const instructorId = request.headers.get("x-user-id");
    if (!instructorId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized instructor" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      category,
      level,
      price,
      thumbnail,
      published,
    } = body;

    if (!title || !category || !level) {
      return NextResponse.json(
        { success: false, message: "Title, Category & Level required" },
        { status: 400 }
      );
    }

    const newCourse = await Course.create({
      title,
      subtitle,
      description,
      category,
      level,
      price,
      thumbnail,
      instructor: instructorId,
      published,
    });

    return NextResponse.json({
      success: true,
      message: "Course created",
      course: newCourse,
    });
  } catch (error) {
    console.error("INSTRUCTOR POST Course Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create course" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await dbConnect();

  try {
    const instructorId = request.headers.get("x-user-id");
    const body = await request.json();

    const {
      id,
      _id,
      title,
      subtitle,
      description,
      category,
      level,
      price,
      thumbnail,
      published,
    } = body;

    const courseId = id || _id;

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Course ID required" },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);

    if (!course || course.instructor.toString() !== instructorId) {
      return NextResponse.json(
        { success: false, message: "Not authorized to edit" },
        { status: 403 }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        subtitle,
        description,
        category,
        level,
        price,
        thumbnail,
        published,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Course updated",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("INSTRUCTOR PUT Course Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await dbConnect();

  try {
    const instructorId = request.headers.get("x-user-id");
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Course ID required" },
        { status: 400 }
      );
    }

    const course = await Course.findById(id);

    if (!course || course.instructor.toString() !== instructorId) {
      return NextResponse.json(
        { success: false, message: "Not authorized to delete" },
        { status: 403 }
      );
    }

    await Course.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Course deleted",
    });
  } catch (error) {
    console.error("INSTRUCTOR DELETE Course Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete course" },
      { status: 500 }
    );
  }
}
