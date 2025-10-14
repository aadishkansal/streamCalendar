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
  parseISO
} from 'date-fns';
import { CalendarDay, VideoEvent } from '@/types/calendar';

const parseDurationToMinutes = (duration: string | undefined): number => {
  if (!duration || typeof duration !== 'string') return 0;
  
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

export const getEventColor = (event: VideoEvent): string =>
  event.completed ? 'bg-green-500' : event.scheduledDate < new Date() ? 'bg-red-500' : 'bg-[#5d57ee]';

export const getEventTextColor = (): string => 'text-white';

export const isEventOverdue = (event: VideoEvent): boolean =>
  !event.completed && event.scheduledDate < new Date();

export const generateCalendarEvents = (project: any, videos: any[]): VideoEvent[] => {
  if (!project || !videos?.length) return [];

  const events: VideoEvent[] = [];
  const { start_date, end_date, timeSlots, days_selected, streak = [] } = project;

  const slots = timeSlots && timeSlots.length > 0
    ? timeSlots
    : project.time_slot_start && project.time_slot_end
    ? [{ startTime: project.time_slot_start, endTime: project.time_slot_end }]
    : [];

  if (slots.length === 0) return [];

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
  let remainingVideoMinutes = 0;
  let currentVideoTitle = '';
  let currentVideoUrl = '';
  let currentVideoThumbnail = '';
  let partNumber = 0;

  const MAX_ITERATIONS = 1000;
  let iterationCount = 0;

  while (date <= lastDate && videoIdx < videos.length && iterationCount < MAX_ITERATIONS) {
    iterationCount++;
    const dow = date.getDay();
    
    if (dayNumbers.includes(dow)) {
      for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
        const slot = slots[slotIndex];

        if (videoIdx >= videos.length && remainingVideoMinutes === 0) break;

        const [sh, sm] = slot.startTime.split(':').map(Number);
        const [eh, em] = slot.endTime.split(':').map(Number);

        const slotStart = new Date(date);
        slotStart.setHours(sh, sm, 0, 0);

        const slotEnd = new Date(date);
        slotEnd.setHours(eh, em, 0, 0);
        
        if (slotEnd <= slotStart) {
          slotEnd.setDate(slotEnd.getDate() + 1);
        }

        let remainingSlotMinutes = (slotEnd.getTime() - slotStart.getTime()) / 60000;
        let currentTime = new Date(slotStart);

        while (remainingSlotMinutes > 0 && (videoIdx < videos.length || remainingVideoMinutes > 0)) {
          
          if (remainingVideoMinutes === 0) {
            const vid = videos[videoIdx];
            const vidMinutes = parseDurationToMinutes(vid.duration);
            
            if (vidMinutes === 0) {
              videoIdx++;
              continue;
            }

            remainingVideoMinutes = vidMinutes;
            currentVideoTitle = vid.title;
            currentVideoUrl = vid.url;
            currentVideoThumbnail = vid.thumbnail || '';
            partNumber = 1;
          }

          const canFitMostOfVideo = remainingSlotMinutes >= (remainingVideoMinutes * 0.8);
          
          if (canFitMostOfVideo || remainingSlotMinutes >= remainingVideoMinutes) {
            const scheduledMinutes = Math.min(remainingVideoMinutes, remainingSlotMinutes);
            const title = (partNumber === 1 && remainingSlotMinutes >= remainingVideoMinutes)
              ? currentVideoTitle
              : `${currentVideoTitle} (Part ${partNumber})`;
            
            const eventDate = new Date(currentTime);

            events.push({
              id: `${project._id}-${videoIdx}-part${partNumber}-${eventDate.toISOString()}`,
              title,
              description: `Video ${videoIdx + 1}/${videos.length}: ${currentVideoTitle}`,
              duration: scheduledMinutes,
              scheduledDate: eventDate,
              scheduledTime: format(eventDate, 'HH:mm'),
              completed: Boolean(streak[videoIdx]),
              videoUrl: currentVideoUrl,
              thumbnail: currentVideoThumbnail,
              projectId: project._id,
              projectName: project.title,
            });

            currentTime = new Date(currentTime.getTime() + scheduledMinutes * 60000);
            remainingSlotMinutes -= scheduledMinutes;
            remainingVideoMinutes -= scheduledMinutes;
            
            if (remainingVideoMinutes === 0) {
              videoIdx++;
              partNumber = 0;
            } else {
              partNumber++;
              break;
            }
          } else {
            break;
          }
        }
      }
    }

    date = addDays(date, 1);
  }

  return events;
};
