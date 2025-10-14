import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Project from "@/model/Project";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { projectId, timeSlots, days_selected, start_date, end_date } = await request.json();
    
    if (!projectId || !Array.isArray(timeSlots)) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const formattedTimeSlots = timeSlots.map((slot: any) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    const updateData: any = {
      timeSlots: formattedTimeSlots,
    };

    // Only update days and dates if provided
    if (days_selected) updateData.days_selected = days_selected;
    if (start_date) updateData.start_date = new Date(start_date);
    if (end_date) updateData.end_date = new Date(end_date);

    await Project.findByIdAndUpdate(projectId, updateData);

    return NextResponse.json({
      success: true,
      message: "Schedule updated successfully",
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { success: false, message: "Error updating schedule" },
      { status: 500 }
    );
  }
}
