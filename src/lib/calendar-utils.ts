// src/lib/calendar-utils.ts

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
  isWeekend as isWeekendDate,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { CalendarDay, VideoEvent } from '@/types/calendar';

// Existing helpers...

export const generateCalendarDays = (currentDate: Date): CalendarDay[] => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: CalendarDay[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push({
      date: day,
      events: [],
      isCurrentMonth: isSameMonth(day, currentDate),
      isToday: isSameDay(day, new Date()),
      isWeekend: isWeekendDate(day)
    });
    day = addDays(day, 1);
  }
  return days;
};

export const generateWeekDays = (currentDate: Date): CalendarDay[] => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      events: [],
      isCurrentMonth: true,
      isToday: isSameDay(date, new Date()),
      isWeekend: isWeekendDate(date)
    };
  });
};

export const generate3Days = (currentDate: Date): CalendarDay[] =>
  [-1, 0, 1].map(offset => {
    const date = addDays(currentDate, offset);
    return {
      date,
      events: [],
      isCurrentMonth: true,
      isToday: isSameDay(date, new Date()),
      isWeekend: isWeekendDate(date)
    };
  });

  export const getEventsForDate = (events: VideoEvent[], date: Date): VideoEvent[] => {
    return events.filter(e => isSameDay(e.scheduledDate, date));
  };
  

export const getEventsForDateRange = (events: VideoEvent[], startDate: Date, endDate: Date): VideoEvent[] =>
  events.filter(event => {
    const d = event.scheduledDate;
    return d >= startOfDay(startDate) && d <= endOfDay(endDate);
  });

export const groupEventsByDate = (events: VideoEvent[]): Record<string, VideoEvent[]> =>
  events.reduce((acc, event) => {
    const key = format(event.scheduledDate, 'yyyy-MM-dd');
    acc[key] = acc[key] || [];
    acc[key].push(event);
    return acc;
  }, {} as Record<string, VideoEvent[]>);

export const navigateDate = (currentDate: Date, direction: 'prev' | 'next', view: string): Date => {
  switch (view) {
    case 'day':
    case '3day':
      return direction === 'next' ? addDays(currentDate, 1) : addDays(currentDate, -1);
    case 'week':
      return direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1);
    case 'month':
      return direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
    default:
      return currentDate;
  }
};

export const formatDateHeader = (date: Date, view: string): string => {
  switch (view) {
    case 'day':
      return format(date, 'EEEE, MMMM d, yyyy');
    case '3day':
      return format(date, 'MMM d');
    case 'week': {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    case 'month':
      return format(date, 'MMMM yyyy');
    default:
      return format(date, 'MMMM yyyy');
  }
};

export const getTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    slots.push(`${String(h).padStart(2,'0')}:00`);
    slots.push(`${String(h).padStart(2,'0')}:30`);
  }
  return slots;
};

export const formatDuration = (min: number): string => {
  const h = Math.floor(min/60), m = min%60;
  if (!h) return `${m}m`;
  if (!m) return `${h}h`;
  return `${h}h ${m}m`;
};

export const getEventColor = (event: VideoEvent): string =>
  event.completed ? 'bg-green-500' : event.scheduledDate < new Date() ? 'bg-red-500' : 'bg-blue-500';

export const getEventTextColor = (): string =>
  'text-white';

export const isEventOverdue = (event: VideoEvent): boolean =>
  !event.completed && event.scheduledDate < new Date();

// NEW: generateCalendarEvents
export const generateCalendarEvents = (project: any, videos: any[]): VideoEvent[] => {
  if (!project || !videos?.length) {
    return [];
  }

  const events: VideoEvent[] = [];
  const { start_date, end_date, time_slot_start, time_slot_end, days_selected, streak = [] } = project;

  const dayNameToNumber: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6
  };

  let dayNumbers: number[] = [];
  if (Array.isArray(days_selected)) {
    if (typeof days_selected[0] === 'number') {
      dayNumbers = days_selected as number[];
    } else if (typeof days_selected[0] === 'string' && dayNameToNumber[days_selected[0]] !== undefined) {
      dayNumbers = (days_selected as string[]).map(d => dayNameToNumber[d]);
    }
  }

  let date = parseISO(start_date);
  const lastDate = parseISO(end_date);
  let videoIdx = 0;

  while (date <= lastDate && videoIdx < videos.length) {
    const iso = date.toISOString().slice(0, 10);
    const dow = date.getDay();

    const match = dayNumbers.includes(dow) || (days_selected as string[]).includes(iso);

    if (match) {
      const [sh, sm] = (time_slot_start as string).split(':').map(Number);
      const [eh, em] = (time_slot_end as string).split(':').map(Number);

      const start = new Date(date);
      start.setHours(sh, sm, 0, 0);

      const end = new Date(start);
      if (eh < sh || (eh === 0 && em === 0)) {
        end.setDate(end.getDate() + 1);
      }
      end.setHours(eh, em, 0, 0);

      const video = videos[videoIdx];
      const completed = Boolean(streak[videoIdx]);

      events.push({
        id: `${project._id}-${videoIdx}-${iso}`,
        title: video.title,
        description: `Video ${videoIdx + 1}/${videos.length}: ${video.title}`,
        duration: (end.getTime() - start.getTime()) / 60000,
        scheduledDate: start,
        scheduledTime: time_slot_start,
        completed,
        videoUrl: video.url,
        thumbnail: video.thumbnail || '',
        projectId: project._id,
        projectName: project.title
      });
      
      videoIdx++;
    }
    date = addDays(date, 1);
  }

  return events;
};

