"use client"

import { useSession } from "next-auth/react";
import DashboardClient from "./DashboardClient";
import CalendarApp from "@/app/components/CalendarApp";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  console.log(user);

  return (
    <div className="max-h-screen w-screen bg-gradient-to-r from-[#5d57ee]/90 to-purple-400">
      <DashboardClient userName={user?.name || "User"} />
      <CalendarApp projectId="" />
    </div>
  );
}