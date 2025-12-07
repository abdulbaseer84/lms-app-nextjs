import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import AssignedCourse from "@/models/AssignedCourse";
import User from "@/models/User";
import Course from "@/models/Course";

await dbConnect();

/* ======================================================
   GET → Fetch all assigned courses
====================================================== */
export async function GET() {
  try {
    const assigned = await AssignedCourse.find()
      .populate("student", "name email")
      .populate("course", "title");

    return NextResponse.json({ success: true, assigned });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load assigned courses" },
      { status: 500 }
    );
  }
}

/* ======================================================
   POST → Assign course to student
====================================================== */
export async function POST(request) {
  try {
    const { studentId, courseId } = await request.json();

    if (!studentId || !courseId) {
      return NextResponse.json(
        { success: false, message: "Student & Course required" },
        { status: 400 }
      );
    }

    // Validate user role
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Invalid student" },
        { status: 400 }
      );
    }

    // Validate course
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Invalid course" },
        { status: 400 }
      );
    }

    // Prevent duplicate assignment
    const exists = await AssignedCourse.findOne({ student: studentId, course: courseId });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Course already assigned to this student" },
        { status: 400 }
      );
    }

    const assign = await AssignedCourse.create({
      student: studentId,
      course: courseId,
    });

    return NextResponse.json({
      success: true,
      message: "Course assigned successfully",
      assigned: assign,
    });
  } catch (error) {
    console.error("POST Error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Course already assigned!" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to assign course" },
      { status: 500 }
    );
  }
}

/* ======================================================
   DELETE → Remove assigned course
====================================================== */
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Assignment ID required" },
        { status: 400 }
      );
    }

    await AssignedCourse.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Assignment removed",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove assignment" },
      { status: 500 }
    );
  }
}
