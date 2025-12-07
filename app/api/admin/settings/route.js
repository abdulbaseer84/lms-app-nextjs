import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Setting from "@/models/Setting";

export async function GET() {
  await dbConnect();

  const settings = await Setting.findOne();
  return NextResponse.json({ settings });
}

export async function POST(request) {
  await dbConnect();

  const body = await request.json();

  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create(body);
  } else {
    settings.siteName = body.siteName;
    settings.siteDescription = body.siteDescription;
    settings.logo = body.logo;
    await settings.save();
  }

  return NextResponse.json({ message: "Settings updated", settings });
}
