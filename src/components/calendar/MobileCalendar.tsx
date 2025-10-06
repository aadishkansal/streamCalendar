

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VideoEvent, CalendarView } from '@/types/calendar';
import { EventCard } from './EventCard';
import { 
  format, 
  addDays, 
  isSameDay, 
  startOfWeek, 
  endOfWeek 
} from 'date-fns';
import { 
  generate3Days, 
  getEventsForDate, 
  navigateDate, 
  formatDateHeader 
} from '@/lib/calendar-utils';
import { ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react';

interface MobileCalendarProps {
  events: VideoEvent[];
  currentDate: Date;
  view: 'day' | '3day';
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onEventComplete: (eventId: string) => Promise<void>;
  onEventClick: (event: VideoEvent) => void;
}

export const MobileCalendar: React.FC<MobileCalendarProps> = ({
  events,
  currentDate,
  view,
  onDateChange,
  onViewChange,
  onEventComplete,
  onEventClick
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNavigate('next');
    } else if (isRightSwipe) {
      handleNavigate('prev');
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [touchStart, touchEnd]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    const newDate = navigateDate(currentDate, direction, view);
    onDateChange(newDate);
  };

  const handleViewToggle = () => {
    const newView = view === 'day' ? '3day' : 'day';
    onViewChange(newView);
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(events, currentDate);
    
    return (
      <div className="h-full flex flex-col">
        {/* Day Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
          <div className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'EEEE')}
          </div>
          <div className="text-sm text-gray-600">
            {format(currentDate, 'MMMM d, yyyy')}
          </div>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No videos scheduled for today</p>
            </div>
          ) : (
            dayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onMarkComplete={onEventComplete}
                onEventClick={onEventClick}
                compact={true}
                showDate={false}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  const render3DayView = () => {
    const days = generate3Days(currentDate);
    
    return (
      <div className="h-full flex flex-col">
        {/* 3-Day Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          <div className="grid grid-cols-3 gap-px bg-gray-200">
            {days.map((day) => {
              const isToday = isSameDay(day.date, new Date());
              const isSelected = isSameDay(day.date, currentDate);
              const dayEvents = getEventsForDate(events, day.date);
              
              return (
                <button
                  key={day.date.toISOString()}
                  onClick={() => onDateChange(day.date)}
                  className={`
                    bg-white p-3 text-center transition-colors relative
                    ${isSelected ? 'bg-blue-50 border-b-2 border-blue-500' : ''}
                    ${isToday && !isSelected ? 'bg-blue-25' : ''}
                    hover:bg-gray-50
                  `}
                >
                  <div className={`
                    text-xs font-medium mb-1
                    ${isToday ? 'text-blue-600' : 'text-gray-600'}
                  `}>
                    {format(day.date, 'EEE')}
                  </div>
                  <div className={`
                    text-lg font-semibold
                    ${isToday ? 'text-blue-600' : 'text-gray-900'}
                  `}>
                    {format(day.date, 'd')}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Events */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {(() => {
            const selectedDayEvents = getEventsForDate(events, currentDate);
            
            if (selectedDayEvents.length === 0) {
              return (
                <div className="text-center py-8">
                  <List className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No videos for this day</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Tap another day to see its schedule
                  </p>
                </div>
              );
            }
            
            return selectedDayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onMarkComplete={onEventComplete}
                onEventClick={onEventClick}
                compact={true}
                showDate={false}
              />
            ));
          })()}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={scrollRef}
      className="h-full flex flex-col bg-gray-50 select-none"
    >
      {/* Mobile Calendar Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleNavigate('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {view === 'day' 
                ? format(currentDate, 'MMMM d')
                : format(currentDate, 'MMMM yyyy')
              }
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Swipe left/right to navigate
            </p>
          </div>

          <button
            onClick={() => handleNavigate('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="mt-4 flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange('day')}
            className={`
              flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${view === 'day' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            Day
          </button>
          <button
            onClick={() => onViewChange('3day')}
            className={`
              flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${view === '3day' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            3 Days
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'day' ? renderDayView() : render3DayView()}
      </div>

      {/* Swipe Indicator */}
      <div className="flex-shrink-0 p-2 text-center">
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-1 bg-gray-300 rounded-full opacity-30"></div>
          <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1 bg-gray-300 rounded-full opacity-30"></div>
        </div>
      </div>
    </div>
  );
};