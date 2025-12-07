import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

// ------------------------------------------------------
// GET → Fetch all users
// ------------------------------------------------------
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().select("-password");

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load users" },
      { status: 500 }
    );
  }
}

// ------------------------------------------------------
// PUT → Update user role
// Body: { userId, role }
// ------------------------------------------------------
export async function PUT(request) {
  try {
    await dbConnect();
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { message: "Missing userId or role" },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(userId, { role });

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}

// ------------------------------------------------------
// DELETE → Delete user
// Body: { userId }
// ------------------------------------------------------
export async function DELETE(request) {
  try {
    await dbConnect();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}
