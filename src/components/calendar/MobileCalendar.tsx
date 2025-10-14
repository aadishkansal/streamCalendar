"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import { VideoEvent, CalendarView } from "@/types/calendar";
import { EventCard } from "./EventCard";
import {
  format,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import {
  generate3Days,
  getEventsForDate,
  navigateDate,
  generateCalendarDays,
} from "@/lib/calendar-utils";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
} from "lucide-react";
import { CalendarArrowDown, HourglassIcon } from "lucide-react";
import {
  IconChevronDown,
  IconChevronUp,
  IconCalendar,
} from "@tabler/icons-react";
import Streaks from "@/app/components/Streaks";
import MainNavbar from "@/app/components/MainNavBar";

export interface MobileCalendarProps {
  events: VideoEvent[];
  currentDate: Date;
  view: "day" | "3day";
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onEventComplete: (eventId: string, shouldUnmark?: boolean) => Promise<void>;
  onEventClick: (event: VideoEvent) => void;
}

const convertToNumberArray = (days: any[]): number[] => {
  if (!days || !Array.isArray(days)) return [1, 2, 3, 4, 5];
  const dayMap: { [key: string]: number } = {
    monday: 1, mon: 1, tuesday: 2, tue: 2, wednesday: 3, wed: 3,
    thursday: 4, thu: 4, friday: 5, fri: 5, saturday: 6, sat: 6,
    sunday: 7, sun: 7,
  };
  return days
    .map((day) => {
      if (typeof day === "number") return day;
      if (typeof day === "string") {
        return dayMap[day.toLowerCase().trim()] || 0;
      }
      return 0;
    })
    .filter((d) => d > 0);
};

const formatDateKey = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildDaySchedule = (eventsForDay: VideoEvent[]) => {
  const sortedEvents = [...eventsForDay].sort((a, b) => 
    a.scheduledDate.getTime() - b.scheduledDate.getTime()
  );
  
  return sortedEvents.map((e) => ({
    id: e.id,
    start: e.scheduledDate.getHours() * 60 + e.scheduledDate.getMinutes(),
    end: e.scheduledDate.getHours() * 60 + e.scheduledDate.getMinutes() + e.duration,
    label: format(e.scheduledDate, 'h:mm a')
  }));
};

const computeNowInsertIndex = (
  schedule: { start: number; end: number }[],
  nowMins: number
) => {
  if (schedule.length === 0) return -1;
  if (nowMins < schedule[0].start) return 0;
  for (let i = 0; i < schedule.length; i++) {
    const cur = schedule[i];
    const next = schedule[i + 1];
    if (nowMins >= cur.start && nowMins < cur.end) return i + 1;
    if (next && nowMins >= cur.end && nowMins < next.start) return i + 1;
  }
  return schedule.length;
};

const NowMarker: React.FC<{ forDate?: Date }> = ({ forDate }) => {
  const now = new Date();
  const shouldShow = forDate ? isSameDay(forDate, now) : true;

  if (!shouldShow) return null;

  return (
    <div className="flex items-center gap-2 my-2 px-1" aria-hidden>
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      <div className="h-[2px] bg-red-500/70 flex-1 rounded-full" />
      <span className="text-xs text-red-600 font-medium">
        {format(now, "h:mm a")}
      </span>
    </div>
  );
};

const MonthCalendarOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  events: VideoEvent[];
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}> = ({ isOpen, onClose, events, currentDate, onDateSelect }) => {
  const [viewMonth, setViewMonth] = useState<Date>(currentDate);

  if (!isOpen) return null;

  const monthDays = generateCalendarDays(viewMonth);
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => setViewMonth(subMonths(viewMonth, 1))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>

          <h3 className="font-semibold text-gray-900">
            {format(viewMonth, "MMMM yyyy")}
          </h3>

          <button
            onClick={() => setViewMonth(addMonths(viewMonth, 1))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid py-4 px-2 grid-cols-7">
          {monthDays.map((day) => {
            const dayEvents = getEventsForDate(events, day.date);
            const isSelected = isSameDay(day.date, currentDate);
            const isToday = isSameDay(day.date, new Date());

            return (
              <button
                key={day.date.toISOString()}
                onClick={() => handleDateClick(day.date)}
                className={`
                  p-2 text-sm relative hover:bg-gray-50 transition-colors
                  ${!day.isCurrentMonth ? "text-gray-400" : "text-gray-900"}
                  ${isSelected ? "bg-[#5d57ee]/10 rounded-full ring-1 ring-[#5d57ee]" : ""}
                  ${isToday ? "font-bold text-[#5d57ee]" : ""}
                `}
              >
                {format(day.date, "d")}
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    <div className="w-1 h-1 bg-[#5d57ee] rounded-full" />
                    {dayEvents.length > 1 && (
                      <div className="w-1 h-1 bg-[#5d57ee]/60 rounded-full" />
                    )}
                    {dayEvents.length > 2 && (
                      <div className="w-1 h-1 bg-[#5d57ee]/40 rounded-full" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={() => {
              setViewMonth(new Date());
              handleDateClick(new Date());
            }}
            className="px-3 py-1.5 text-sm font-medium text-[#5d57ee] hover:bg-[#5d57ee]/10 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export function MobileCalendar({
  events,
  currentDate,
  view,
  onDateChange,
  onViewChange,
  onEventComplete,
  onEventClick,
}: MobileCalendarProps): React.ReactElement {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const minSwipeDistance = 50;

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(false);
  const [isPastUncompletedExpanded, setIsPastUncompletedExpanded] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [scheduledDayNumbers, setScheduledDayNumbers] = useState<number[]>([1, 2, 3, 4, 5]);

  const projectId = events[0]?.projectId;

  useEffect(() => {
    if (!projectId) return;
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`/api/schedule-project/${projectId}`);
        if (response.data?.success) {
          const project = response.data.project;
          setProjectData(project);
          const convertedDays = convertToNumberArray(project.days_selected || []);
          setScheduledDayNumbers(convertedDays);
        }
      } catch (err) {
        console.error("Error fetching project", err);
      }
    };
    fetchProjectData();
  }, [projectId]);

  const completionMap = useMemo(() => {
    const map = new Map<string, {
      totalVideos: number;
      completedVideos: number;
      completedOnSameDay: number;
      completionPercentage: number;
      isStreakEligible: boolean;
    }>();

    const eventsByDate = new Map<string, VideoEvent[]>();
    
    events.forEach((event) => {
      const dateKey = formatDateKey(event.scheduledDate);
      if (!eventsByDate.has(dateKey)) {
        eventsByDate.set(dateKey, []);
      }
      eventsByDate.get(dateKey)!.push(event);
    });

    eventsByDate.forEach((dayEvents, dateKey) => {
      const totalVideos = dayEvents.length;
      const completedVideos = dayEvents.filter(e => e.completed).length;
      
      const completedOnSameDay = dayEvents.filter(event => {
        if (!event.completed) return false;
        
        const eventIndex = events.findIndex(e => e.id === event.id);
        const completionTimestamp = projectData?.completion_timestamps?.[eventIndex];
        
        if (!completionTimestamp) return true;
        
        const completedDate = formatDateKey(new Date(completionTimestamp));
        return completedDate === dateKey;
      }).length;

      const completionPercentage = (completedOnSameDay / totalVideos) * 100;
      const isStreakEligible = completionPercentage >= 50;

      map.set(dateKey, {
        totalVideos,
        completedVideos,
        completedOnSameDay,
        completionPercentage,
        isStreakEligible
      });
    });

    return map;
  }, [events, projectData]);

  const upcomingEvents = useMemo(
    () => events.filter((e) => !e.completed && new Date(e.scheduledDate) >= new Date()).slice(0, 5),
    [events]
  );

  const pastUncompletedEvents = useMemo(
    () =>
      events
        .filter((e) => !e.completed && new Date(e.scheduledDate) < new Date())
        .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
        .slice(0, 5),
    [events]
  );

  const onTouchStartHandler = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMoveHandler = (e: TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  
  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNavigate("next");
    else if (distance < -minSwipeDistance) handleNavigate("prev");
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.addEventListener("touchstart", onTouchStartHandler as any, { passive: true });
    element.addEventListener("touchmove", onTouchMoveHandler as any, { passive: true });
    element.addEventListener("touchend", onTouchEndHandler as any, { passive: true });
    return () => {
      element.removeEventListener("touchstart", onTouchStartHandler as any);
      element.removeEventListener("touchmove", onTouchMoveHandler as any);
      element.removeEventListener("touchend", onTouchEndHandler as any);
    };
  }, [touchStart, touchEnd]);

  const handleNavigate = (direction: "prev" | "next") => {
    onDateChange(navigateDate(currentDate, direction, view));
  };

  const goToToday = () => onDateChange(new Date());

  const renderDayView = () => {
    const dayEvents = getEventsForDate(events, currentDate);
    const schedule = buildDaySchedule(dayEvents);
    const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const insertIndex = computeNowInsertIndex(schedule, nowMins);

    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
          <div className="text-lg text-center font-semibold text-gray-900">
            {format(currentDate, "EEEE")}
          </div>
          <div className="text-sm text-center text-gray-600">
            {format(currentDate, "MMMM d, yyyy")}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No videos scheduled for this day</p>
              <NowMarker forDate={currentDate} />
            </div>
          ) : (
            dayEvents.map((event, idx) => {
              const eventIndex = events.findIndex(e => e.id === event.id);
              const completionTimestamp = projectData?.completion_timestamps?.[eventIndex]
                ? new Date(projectData.completion_timestamps[eventIndex])
                : null;

              const card = (
                <EventCard
                  key={event.id}
                  event={event}
                  computedStartTime={schedule[idx]?.label}
                  onMarkComplete={(id, unmark) => onEventComplete(id, unmark)}
                  onEventClick={onEventClick}
                  compact
                  showDate={false}
                  completionTimestamp={completionTimestamp}
                />
              );

              if (insertIndex === idx) {
                return (
                  <React.Fragment key={`${event.id}-with-now`}>
                    <NowMarker forDate={currentDate} />
                    {card}
                  </React.Fragment>
                );
              }
              if (insertIndex === dayEvents.length && idx === dayEvents.length - 1) {
                return (
                  <React.Fragment key={`${event.id}-end-now`}>
                    {card}
                    <NowMarker forDate={currentDate} />
                  </React.Fragment>
                );
              }
              return card;
            })
          )}
        </div>
      </div>
    );
  };

  const render3DayView = () => {
    const days = generate3Days(currentDate);
    const today = new Date();

    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          <div className="grid grid-cols-3 gap-px bg-gray-200">
            {days.map((day) => {
              const isToday = isSameDay(day.date, today);
              const isSelected = isSameDay(day.date, currentDate);
              const dayEvents = getEventsForDate(events, day.date);
              return (
                <button
                  key={day.date.toISOString()}
                  onClick={() => onDateChange(day.date)}
                  className={`
                    bg-white p-3 text-center transition-colors relative
                    ${isSelected ? "bg-[#5d57ee]/10 border-b-2 border-[#5d57ee]" : ""}
                    ${isToday && !isSelected ? "bg-blue-25" : ""}
                    hover:bg-[#5d57ee]/10
                  `}
                >
                  <div className={`text-xs font-medium mb-1 ${isToday ? "text-gray-700" : "text-gray-600"}`}>
                    {format(day.date, "EEE")}
                  </div>
                  <div className={`text-lg font-semibold ${isToday ? "text-gray-700" : "text-gray-900"}`}>
                    {format(day.date, "d")}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-[#5d57ee] rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {(() => {
            const selectedDayEvents = getEventsForDate(events, currentDate);
            if (selectedDayEvents.length === 0) {
              return (
                <div className="text-center py-8">
                  <List className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No videos scheduled for this day</p>
                  <NowMarker forDate={currentDate} />
                </div>
              );
            }

            const schedule = buildDaySchedule(selectedDayEvents);
            const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();
            const insertIndex = computeNowInsertIndex(schedule, nowMins);

            return selectedDayEvents.map((event, idx) => {
              const eventIndex = events.findIndex(e => e.id === event.id);
              const completionTimestamp = projectData?.completion_timestamps?.[eventIndex]
                ? new Date(projectData.completion_timestamps[eventIndex])
                : null;

              const card = (
                <EventCard
                  key={event.id}
                  event={event}
                  computedStartTime={schedule[idx]?.label}
                  onMarkComplete={(id, unmark) => onEventComplete(id, unmark)}
                  onEventClick={onEventClick}
                  compact
                  showDate={false}
                  completionTimestamp={completionTimestamp}
                />
              );

              if (insertIndex === idx) {
                return (
                  <React.Fragment key={`${event.id}-with-now`}>
                    <NowMarker forDate={currentDate} />
                    {card}
                  </React.Fragment>
                );
              }
              if (insertIndex === selectedDayEvents.length && idx === selectedDayEvents.length - 1) {
                return (
                  <React.Fragment key={`${event.id}-end-now`}>
                    {card}
                    <NowMarker forDate={currentDate} />
                  </React.Fragment>
                );
              }
              return card;
            });
          })()}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 select-none">
      <div className="flex justify-center px-2 ml-4 py-1 mb-2">
        <MainNavbar />
      </div>

      <div className="bg-[#5d57ee]/5 mt-16 p-2">
        <div className="bg-white rounded-xl border px-3 py-1 border-gray-200 mb-2">
          <Streaks completionMap={completionMap} scheduledDays={scheduledDayNumbers} />
        </div>

        <div>
          <button
            onClick={() => setIsInsightsOpen((v) => !v)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <HourglassIcon className="h-5 w-5 text-[#5d57ee]" />
              <span className="text-sm font-semibold text-[#5d57ee]">Insights</span>
            </div>
            {isInsightsOpen ? (
              <IconChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <IconChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {isInsightsOpen && (
            <div className="mt-3 space-y-3">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HourglassIcon className="h-5 w-5 text-[#5d57ee]" />
                  <h3 className="text-sm font-bold text-[#5d57ee]">Progress</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {events.filter((e) => e.completed).length}
                    </div>
                    <div className="text-xs font-medium text-gray-500">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {events.filter((e) => !e.completed).length}
                    </div>
                    <div className="text-xs font-medium text-gray-500">Pending</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                <button
                  onClick={() => setIsPastUncompletedExpanded((v) => !v)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CalendarArrowDown className="h-5 w-5 text-red-600" />
                    <h3 className="text-sm font-bold text-red-600">Past Uncompleted</h3>
                    <span className="text-xs bg-red-600 text-white rounded-full px-2 py-0.5">
                      {pastUncompletedEvents.length}
                    </span>
                  </div>
                  {isPastUncompletedExpanded ? (
                    <IconChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <IconChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>

                {isPastUncompletedExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {pastUncompletedEvents.length > 0 ? (
                      pastUncompletedEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors border border-red-100"
                          onClick={() => onEventClick(event)}
                        >
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {event.title}
                          </div>
                          <div className="text-xs text-red-600 mt-1">
                            {new Date(event.scheduledDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center font-bold py-4 text-sm text-red-600">
                        No past uncompleted events
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                <button
                  onClick={() => setIsUpcomingExpanded((v) => !v)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CalendarArrowDown className="h-5 w-5 text-[#5d57ee]" />
                    <h3 className="text-sm font-bold text-[#5d57ee]">Upcoming Events</h3>
                    <span className="text-xs bg-[#5d57ee] text-white rounded-full px-2 py-0.5">
                      {upcomingEvents.length}
                    </span>
                  </div>
                  {isUpcomingExpanded ? (
                    <IconChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <IconChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>

                {isUpcomingExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100"
                          onClick={() => onEventClick(event)}
                        >
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {event.title}
                          </div>
                          <div className="text-xs text-[#5d57ee] mt-1">
                            {new Date(event.scheduledDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center font-bold py-4 text-sm text-[#5d57ee]">
                        No upcoming events
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2 mt-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigate("prev")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {view === "day" ? format(currentDate, "MMMM d") : format(currentDate, "MMMM yyyy")}
            </h2>

            <button
              onClick={() => setShowMonthCalendar(true)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Show month view"
            >
              <IconCalendar className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <button
            onClick={() => handleNavigate("next")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="mt-4 flex bg-[#5d57ee]/20 rounded-xl p-2">
          <button
            onClick={() => onViewChange("day")}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              view === "day" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => {
              onViewChange("day");
              goToToday();
            }}
            className="flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors text-gray-600 hover:text-gray-900"
            title="Go to today"
          >
            Today
          </button>
          <button
            onClick={() => onViewChange("3day")}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
              view === "3day" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            3 Days
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-hidden">
        {view === "day" ? renderDayView() : render3DayView()}
      </div>

      <div className="flex-shrink-0 p-2 text-center">
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-1 bg-gray-300 rounded-full opacity-30" />
          <div className="w-8 h-1 bg-[#5d57ee] rounded-full" />
          <div className="w-8 h-1 bg-gray-300 rounded-full opacity-30" />
        </div>
      </div>

      <MonthCalendarOverlay
        isOpen={showMonthCalendar}
        onClose={() => setShowMonthCalendar(false)}
        events={events}
        currentDate={currentDate}
        onDateSelect={onDateChange}
      />
    </div>
  );
}
