import { verifyToken } from "@/utils/jwt";

export function getAuthUser(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("token="));

  if (!token) return null;

  const actualToken = token.split("=")[1];
  const data = verifyToken(actualToken);
  return data;
}
