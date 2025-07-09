"use client"

import CalendarApp from "@/app/components/CalendarApp";

interface CalendarPageProps {
  params: {
    projectId: string;
  };
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const { projectId } = params;

  return (
    <div className="min-h-screen">
      <CalendarApp projectId={projectId} />
    </div>
  );
}