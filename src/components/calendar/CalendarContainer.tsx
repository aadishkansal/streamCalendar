"use client";

import React, { useState } from 'react';
import { useCalendarData } from './hooks/useCalendarData';
import { useResponsiveView } from './hooks/useResponsiveView';
import { MobileCalendar } from './MobileCalendar';
import { CalendarSidebar } from './CalendarSidebar';
import { VideoEvent, CalendarView } from '@/types/calendar';

interface CalendarContainerProps {
  projectId: string; 
  initialDate?: Date;
  initialView?: CalendarView;
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  projectId, 
  initialDate = new Date(),
  initialView
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  
  const { 
    events, 
    error,
    loading, 
    markEventComplete,
    unmarkEventComplete,
    refetch 
  } = useCalendarData(projectId);
  
  const { 
    isMobile, 
    currentView, 
    setView 
  } = useResponsiveView(initialView);

  const handleEventComplete = async (eventId: string, shouldUnmark: boolean = false) => {
    try {
      if (shouldUnmark) {
        // Check if unmarkEventComplete exists before calling
        if (unmarkEventComplete) {
          await unmarkEventComplete(eventId);
        } else {
          console.error('Unmark function not available');
        }
      } else {
        await markEventComplete(eventId);
      }
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleEventClick = (event: VideoEvent) => {
    if (event.videoUrl) {
      window.open(event.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleViewChange = (view: CalendarView) => {
    setView(view);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#5d57ee]/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d57ee] mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#5d57ee]/10">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-800 mb-2">Error Loading Calendar</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-[#5d57ee] text-white rounded-lg hover:bg-[#5d57ee]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="h-screen overflow-hidden">
        <MobileCalendar
          events={events}
          currentDate={currentDate}
          view={currentView as 'day' | '3day'}
          onDateChange={handleDateChange}
          onViewChange={handleViewChange}
          onEventComplete={handleEventComplete}
          onEventClick={handleEventClick}
        />
      </div>
    );
  }

  return (
    <CalendarSidebar
      events={events}
      currentDate={currentDate}
      view={currentView as 'week' | 'month'}
      onDateChange={handleDateChange}
      onViewChange={handleViewChange}
      onEventComplete={handleEventComplete}
      onEventClick={handleEventClick}
    />
  );
};
