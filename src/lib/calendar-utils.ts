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

// Helper to parse HH:MM:SS duration to minutes with null safety
const parseDurationToMinutes = (duration: string | undefined): number => {
  if (!duration || typeof duration !== 'string') {
    return 0;
  }
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 60 + minutes + Math.ceil(seconds / 60);
  }
  return 0;
};

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

export const getEventsForDate = (events: VideoEvent[], date: Date): VideoEvent[] =>
  events.filter(e => isSameDay(e.scheduledDate, date));

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
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
};

export const formatDuration = (min: number): string => {
  const h = Math.floor(min / 60), m = min % 60;
  if (!h) return `${m}m`;
  if (!m) return `${h}h`;
  return `${h}h ${m}m`;
};

export const  getEventColor = (event: VideoEvent): string =>
  event.completed ? 'bg-green-500' : event.scheduledDate < new Date() ? 'bg-red-500' : 'bg-[#5d57ee]';

export const getEventTextColor = (): string =>
  'text-white';

export const isEventOverdue = (event: VideoEvent): boolean =>
  !event.completed && event.scheduledDate < new Date();

export const generateCalendarEvents = (project: any, videos: any[]): VideoEvent[] => {
  if (!project || !videos?.length) return [];

  const events: VideoEvent[] = [];
  const {
    start_date,
    end_date,
    time_slot_start,
    time_slot_end,
    days_selected,
    streak = []
  } = project;

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
    const dow = date.getDay();
    if (dayNumbers.includes(dow)) {
      const [sh, sm] = (time_slot_start as string).split(':').map(Number);
      const [eh, em] = (time_slot_end as string).split(':').map(Number);

      const slotStart = new Date(date);
      slotStart.setHours(sh, sm, 0, 0);

      const slotEnd = new Date(slotStart);
      if (eh < sh || (eh === 0 && em === 0)) {
        slotEnd.setDate(slotEnd.getDate() + 1);
      }
      slotEnd.setHours(eh, em, 0, 0);

      let remainingMinutes = (slotEnd.getTime() - slotStart.getTime()) / 60000;

      while (videoIdx < videos.length) {
        const vid = videos[videoIdx];
        const vidMinutes = parseDurationToMinutes(vid.duration);
        
        if (vidMinutes === 0) {
          videoIdx++;
          continue;
        }
        
        if (remainingMinutes >= vidMinutes) {
          const eventDate = new Date(slotStart);

          events.push({
            id: `${project._id}-${videoIdx}-${eventDate.toISOString().slice(0,10)}`,
            title: vid.title,
            description: `Video ${videoIdx + 1}/${videos.length}: ${vid.title}`,
            duration: vidMinutes,
            scheduledDate: eventDate,
            scheduledTime: time_slot_start,
            completed: Boolean(streak[videoIdx]),
            videoUrl: vid.url,
            thumbnail: vid.thumbnail || '',
            projectId: project._id,
            projectName: project.title,
          });

          remainingMinutes -= vidMinutes;
          videoIdx++;
        } else {
          break;
        }
      }
    }

    date = addDays(date, 1);
  }

  return events;
};
