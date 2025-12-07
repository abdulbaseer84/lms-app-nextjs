import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  await dbConnect();

  const { username, name, email, phone, password, confirmPassword } =
    await request.json();

  // Required validation
  if (!username || !name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { message: "Please fill all required fields" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { message: "Passwords do not match" },
      { status: 400 }
    );
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return NextResponse.json({ message: "Email already registered" }, { status: 400 });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return NextResponse.json({ message: "Username already taken" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    name,
    email,
    phone,
    password: hashed,
  });

  return NextResponse.json(
    { message: "Registration successful", userId: user._id },
    { status: 201 }
  );
}
