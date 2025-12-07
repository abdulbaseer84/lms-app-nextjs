import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/utils/jwt";

export async function POST(request) {
  await dbConnect();

  const { email, password } = await request.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ message: "Wrong password" }, { status: 400 });
  }

  const token = generateToken(user);

  const response = NextResponse.json({
    message: "Login successful",
    user: { id: user._id, name: user.name, role: user.role },
  });

response.cookies.set("token", token, {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: false,  // for localhost (MUST be false)
});


  return response;
}
