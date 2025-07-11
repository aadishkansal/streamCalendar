"use client"

import { use } from 'react'
import CalendarApp from "@/app/components/CalendarApp";

interface CalendarPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const { projectId } = use(params);

  return (
    <div className="min-h-screen">
      <CalendarApp projectId={projectId} />
    </div>
  );
}