export interface VideoEvent {
    id: string;
    title: string;
    description?: string;
    duration: number; // in minutes
    scheduledDate: Date;
    scheduledTime?: string;
    completed: boolean;
    videoUrl: string;
    thumbnail?: string;
    projectId: string;
    projectName: string;
  }
  
  export interface CalendarDay {
    date: Date;
    events: VideoEvent[];
    isCurrentMonth: boolean;
    isToday: boolean;
    isWeekend: boolean;
  }
  
  export type CalendarView = 'day' | '3day' | 'week' | 'month';
  export type MobileView = 'day' | '3day';
  export type DesktopView = 'week' | 'month';
  
  export interface CalendarProps {
    events: VideoEvent[];
    currentDate: Date;
    view: CalendarView;
    onDateChange: (date: Date) => void;
    onViewChange: (view: CalendarView) => void;
    onEventComplete: (eventId: string) => void;
    onEventClick: (event: VideoEvent) => void;
  }
  
  export interface UseCalendarDataReturn {
    events: VideoEvent[];
    loading: boolean; 
    error: string | null;
    refetch: () => Promise<void>;
    markEventComplete: (eventId: string) => Promise<void>;
    unmarkEventComplete?: (eventId: string) => Promise<void>; // Add this
  }
  
  export interface CalendarState {
    currentDate: Date;
    selectedDate: Date | null;
    view: CalendarView;
    events: VideoEvent[];
  }