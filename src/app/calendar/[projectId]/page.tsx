"use client"

import { use } from 'react';
import { CalendarContainer } from '@/components/calendar/CalendarContainer';

interface CalendarPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const { projectId } = use(params);

  return <CalendarContainer projectId={projectId} />;
}
