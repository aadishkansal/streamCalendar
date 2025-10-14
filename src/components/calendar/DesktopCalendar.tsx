'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VideoEvent, CalendarView } from '@/types/calendar';
import { 
  format, 
  isSameDay, 
  startOfWeek, 
  endOfWeek 
} from 'date-fns';
import { 
  generateCalendarDays, 
  generateWeekDays, 
  getEventsForDate, 
  navigateDate 
} from '@/lib/calendar-utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Check,
  Clock,
  Play,
  Video,
  FileText,
  X
} from 'lucide-react';

interface DesktopCalendarProps {
  events: VideoEvent[];
  currentDate: Date;
  view: 'week' | 'month';
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onEventComplete: (eventId: string, shouldUnmark?: boolean) => Promise<void>;
  onEventClick: (event: VideoEvent) => void;
}

export const DesktopCalendar: React.FC<DesktopCalendarProps> = ({
  events,
  currentDate,
  view,
  onDateChange,
  onViewChange,
  onEventComplete,
  onEventClick
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredEvent, setHoveredEvent] = useState<{ 
    event: VideoEvent; 
    x: number; 
    y: number;
    actualStartTime: string;
    actualDuration: number;
  } | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = navigateDate(currentDate, direction, view);
    onDateChange(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const handleEventHover = (
    event: VideoEvent, 
    e: React.MouseEvent, 
    actualStartTime?: string, 
    actualDuration?: number
  ) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredEvent({
      event,
      x: rect.left + rect.width / 2,
      y: rect.bottom,
      actualStartTime: actualStartTime || event.scheduledTime || '',
      actualDuration: actualDuration || event.duration
    });
  };

  const handleEventLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredEvent(null);
    }, 200);
  };

  const handleTooltipEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleTooltipLeave = () => {
    setHoveredEvent(null);
  };

  // ✅ Helper to detect overlapping events and assign columns
  const getEventColumns = (dayEvents: VideoEvent[]) => {
    const sorted = [...dayEvents].sort((a, b) => 
      a.scheduledDate.getTime() - b.scheduledDate.getTime()
    );

    const columns: VideoEvent[][] = [];
    
    sorted.forEach(event => {
      const eventStart = event.scheduledDate.getTime();
      const eventEnd = eventStart + event.duration * 60000;
      
      let placed = false;
      
      // Try to place in existing column
      for (let col of columns) {
        const lastEvent = col[col.length - 1];
        const lastEnd = lastEvent.scheduledDate.getTime() + lastEvent.duration * 60000;
        
        if (eventStart >= lastEnd) {
          col.push(event);
          placed = true;
          break;
        }
      }
      
      // Create new column if couldn't place
      if (!placed) {
        columns.push([event]);
      }
    });

    // Build map: event.id => { column, totalColumns }
    const eventPositions = new Map<string, { column: number; totalColumns: number }>();
    const totalCols = columns.length;
    
    columns.forEach((col, colIndex) => {
      col.forEach(event => {
        eventPositions.set(event.id, { column: colIndex, totalColumns: totalCols });
      });
    });

    return eventPositions;
  };

  // Tooltip Component
  const EventTooltip = () => {
    if (!hoveredEvent) return null;

    const { event, x, y, actualStartTime, actualDuration } = hoveredEvent;
    const tooltipWidth = 320;
    const viewportWidth = window.innerWidth;
    
    let tooltipX = x - tooltipWidth / 2;
    if (tooltipX < 10) tooltipX = 10;
    if (tooltipX + tooltipWidth > viewportWidth - 10) tooltipX = viewportWidth - tooltipWidth - 10;

    return (
      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4"
        style={{
          left: `${tooltipX}px`,
          top: `${y + 10}px`,
          width: `${tooltipWidth}px`,
        }}
        onMouseEnter={handleTooltipEnter}
        onMouseLeave={handleTooltipLeave}
      >
        <div
          className="absolute w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45"
          style={{
            top: '-6px',
            left: `${x - tooltipX - 6}px`,
          }}
        />

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{event.title}</h4>
            {event.completed && (
              <span className="flex-shrink-0 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                Completed
              </span>
            )}
          </div>

          {event.description && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 line-clamp-3">{event.description}</p>
            </div>
          )}

          {actualStartTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-700 font-medium">{actualStartTime}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-700">
              Duration: {Math.floor(actualDuration / 60)}h {actualDuration % 60}m
            </span>
          </div>

          {event.videoUrl && (
            <div className="pt-2 border-t border-gray-100">
              <a
                href={event.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#5d57ee] hover:text-[#4a47cc] font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Play className="h-3.5 w-3.5" />
                Watch Video
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ---------------- MONTH VIEW ----------------
  const renderMonthView = () => {
    const days = generateCalendarDays(currentDate);
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-700">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center space-x-1">
                <button onClick={() => handleNavigate('prev')} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <button onClick={() => handleNavigate('next')} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => onDateChange(new Date())} className="px-3 py-1.5 text-sm font-medium text-[#5d57ee] border-[#5d57ee]/30 hover:bg-gray-200 rounded-xl transition-colors border">
                Today
              </button>
              <button onClick={() => onViewChange('week')} className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-xl border ${view === 'week' ? 'bg-[#5d57ee]/10 text-[#5d57ee] border-[#5d57ee]/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                Week
              </button>
              <button onClick={() => onViewChange('month')} className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-xl border ${view === 'month' ? 'bg-[#5d57ee]/10 text-[#5d57ee] border-[#5d57ee]/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                Month
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 bg-gray-50">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayEvents = getEventsForDate(events, day.date);
            const isSelected = selectedDate && isSameDay(day.date, selectedDate);

            return (
              <div
                key={day.date.toISOString()}
                className={`min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50
                  ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                  ${day.isToday ? 'bg-[#5d57ee]/10' : ''}
                  ${isSelected ? 'bg-[#5d57ee]/20' : ''} last:border-r-0`}
                onClick={() => handleDateClick(day.date)}
              >
                <div className={`text-sm font-medium mb-2 ${day.isToday ? 'text-[#5d57ee] font-semibold' : ''}`}>
                  {format(day.date, 'd')}
                </div>

                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-2 rounded truncate cursor-pointer transition-colors ${event.completed ? 'bg-green-500 text-white' : 'bg-[#5d57ee] text-white'} hover:opacity-80`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      onMouseEnter={(e) => handleEventHover(event, e)}
                      onMouseLeave={handleEventLeave}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ---------------- WEEK VIEW WITH OVERLAP HANDLING ----------------
  const renderWeekView = () => {
    const days = generateWeekDays(currentDate);
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = Array.from({ length: 24 }, (_, i) =>
      i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`
    );

    const hourHeightPx = 64;

    const getCurrentTimePosition = () => {
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const totalHours = hours + minutes / 60;
      return totalHours * hourHeightPx;
    };

    const shouldShowTimeIndicator = days.some(day => day.isToday);
    const todayColumnIndex = days.findIndex(day => day.isToday);

    return (
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-600">
                {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} - {format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}
              </h2>
              <div className="flex items-center space-x-1">
                <button onClick={() => handleNavigate('prev')} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <button onClick={() => handleNavigate('next')} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => onDateChange(new Date())} className="px-3 py-1.5 text-sm font-medium text-[#5d57ee] border-[#5d57ee]/30 hover:bg-gray-200 rounded-xl transition-colors border">
                Today
              </button>
              <button onClick={() => onViewChange('week')} className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-xl border ${view === 'week' ? 'bg-[#5d57ee]/10 text-[#5d57ee] border-[#5d57ee]/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                Week
              </button>
              <button onClick={() => onViewChange('month')} className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-xl border ${view === 'month' ? 'bg-[#5d57ee]/10 text-[#5d57ee] border-[#5d57ee]/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                Month
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-[70vh] overflow-auto relative">
          <div className="sticky top-0 z-20 bg-gray-50 border-b flex">
            <div className="w-20 h-12 border-r flex-shrink-0" />
            {days.map((day, idx) => (
              <div 
                key={day.date.toISOString()} 
                className={`flex-1 text-center py-3 font-medium text-sm border-r last:border-0 cursor-pointer hover:bg-gray-100 transition-colors ${day.isToday ? 'text-[#5d57ee] bg-[#5d57ee]/5' : 'text-gray-700'}`}
                onClick={() => handleDateClick(day.date)}
              >
                {weekDays[idx].slice(0, 3)} {format(day.date, 'd')}
              </div>
            ))}
          </div>

          <div className="relative" style={{ height: `${24 * hourHeightPx}px` }}>
            {hours.map((hourLabel, hrIdx) => (
              <div key={`row-${hrIdx}`} className="flex" style={{ height: `${hourHeightPx}px` }}>
                <div className="w-20 flex-shrink-0 flex items-start justify-end pr-2 border-b border-r border-gray-100 bg-gray-50 text-xs text-gray-500 pt-1">
                  {hourLabel}
                </div>
                {days.map((day) => (
                  <div key={`${day.date.toISOString()}-${hrIdx}`} className="flex-1 border-b border-r last:border-r-0 border-gray-100" />
                ))}
              </div>
            ))}

            {shouldShowTimeIndicator && todayColumnIndex !== -1 && (
              <>
                <div className="absolute z-30 pointer-events-none" style={{ top: `${getCurrentTimePosition() - 6}px`, left: `calc(80px + ((100% - 80px) / 7) * ${todayColumnIndex})`, width: '12px', height: '12px', backgroundColor: '#EA4335', borderRadius: '50%' }} />
                <div className="absolute z-29 pointer-events-none" style={{ top: `${getCurrentTimePosition()}px`, left: `calc(80px + ((100% - 80px) / 7) * ${todayColumnIndex})`, width: `calc((100% - 80px) / 7)`, height: '2px', backgroundColor: '#EA4335' }} />
              </>
            )}

            {/* ✅ Events with overlap detection */}
            {days.map((day, dIdx) => {
              const dayEvents = getEventsForDate(events, day.date);
              if (dayEvents.length === 0) return null;

              const eventPositions = getEventColumns(dayEvents);

              return dayEvents.map((event) => {
                const eventStartTime = event.scheduledDate;
                const hours = eventStartTime.getHours();
                const minutes = eventStartTime.getMinutes();
                const startHours = hours + minutes / 60;
                const topPosition = startHours * hourHeightPx;
                const eventHeight = Math.max((event.duration / 60) * hourHeightPx, 50);
                
                const position = eventPositions.get(event.id);
                const column = position?.column ?? 0;
                const totalColumns = position?.totalColumns ?? 1;
                
                // ✅ Calculate width and left position based on columns
                const columnWidth = 100 / totalColumns;
                const leftOffset = column * columnWidth;
                
                return (
                  <div
                    key={event.id}
                    className={`absolute z-10 rounded-xl px-2 py-1 shadow-md cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:z-20 group
                      ${event.completed ? 'bg-green-500' : 'bg-[#5d57ee]'} text-white`}
                    style={{
                      top: `${topPosition}px`,
                      left: `calc(80px + ((100% - 80px) / 7) * ${dIdx} + ((100% - 80px) / 7) * ${leftOffset / 100} + 4px)`,
                      width: `calc((100% - 80px) / 7 * ${columnWidth / 100} - 8px)`,
                      height: `${eventHeight}px`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    onMouseEnter={(e) => handleEventHover(event, e, format(eventStartTime, 'h:mm a'), event.duration)}
                    onMouseLeave={handleEventLeave}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="text-xs font-semibold truncate flex-1">{event.title}</div>
                      {!event.completed ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventComplete(event.id, false);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/40 rounded p-0.5 flex-shrink-0"
                          title="Mark Complete"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventComplete(event.id, true);
                          }}
                          className="bg-white/30 hover:bg-white/50 rounded p-0.5 flex-shrink-0 transition-colors"
                          title="Unmark Complete"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {eventHeight > 40 && (
                      <div className="text-[10px] opacity-90 flex items-center gap-1 mb-1">
                        <Clock className="h-2.5 w-2.5" />
                        {Math.floor(event.duration / 60)}h {event.duration % 60}m
                      </div>
                    )}

                    {event.videoUrl && eventHeight > 60 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(event.videoUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white/20 hover:bg-white/40 rounded px-1.5 py-0.5 text-[10px]"
                      >
                        <Play className="h-2.5 w-2.5" />
                        Watch
                      </button>
                    )}
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    );
  };

  // ---------------- TODAY'S EVENTS SECTION ----------------
  const renderEventsSection = () => {
    if (!selectedDate) return null;

    const selectedDayEvents = getEventsForDate(events, selectedDate);
    const isToday = isSameDay(selectedDate, new Date());

    return (
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold  text-[#5d57ee]">
            Events for {isToday ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          {!isToday && (
            <button 
              onClick={() => setSelectedDate(null)} 
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {selectedDayEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No videos scheduled for this day</p>
            </div>
          ) : (
            selectedDayEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-50  rounded-xl p-4 border border-gray-200 hover:border-[#5d57ee] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{event.description}</p>
                  </div>
                  
                  {event.completed ? (
                    <button
                      onClick={() => onEventComplete(event.id, true)}
                      className="ml-2 bg-green-500 text-white rounded p-1.5 hover:bg-green-600 transition-colors"
                      title="Unmark Complete"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onEventComplete(event.id, false)}
                      className="ml-2 bg-gray-200 text-gray-600 rounded p-1.5 hover:bg-gray-300 transition-colors"
                      title="Mark Complete"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(event.scheduledDate, 'h:mm a')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      {Math.floor(event.duration / 60)}h {event.duration % 60}m
                    </span>
                  </div>

                  {event.videoUrl && (
                    <a
                      href={event.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#5d57ee] hover:text-[#4a47cc] font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Play className="h-3 w-3" />
                      Watch
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {view === 'month' ? renderMonthView() : renderWeekView()}
      
      <EventTooltip />
      
      {renderEventsSection()}
    </div>
  );
};
