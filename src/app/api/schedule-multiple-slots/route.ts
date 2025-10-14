import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project from "@/model/Project";

export async function POST(request: Request) {
  await dbConnect();
  const { projectId, slots } = await request.json();
  if (!projectId || !Array.isArray(slots)) {
    return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
  }

  await Project.findByIdAndUpdate(projectId, { timeSlots: slots });
  return NextResponse.json({ success: true });
}
