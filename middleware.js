import { NextResponse } from "next/server";
import { verifyToken } from "./utils/jwt";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Public paths (no token required) 
  if (path.startsWith("/")) {
    return NextResponse.next();
  }
  // No token = block dashboard 
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  // Verify token 
  const user = verifyToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  // ADMIN ROUTES 
  if (path.startsWith("/dashboard/admin") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // INSTRUCTOR ROUTES 
  if (path.startsWith("/dashboard/instructor") && !["admin", "instructor"].includes(user.role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } return NextResponse.next();
}
export const config = {
  matcher: [],
};