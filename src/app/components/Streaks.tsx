import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { type DateRange } from "react-day-picker";
import { startOfDay, subDays, getDay } from "date-fns";
import { FlameIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface DayCompletion {
  totalVideos: number;
  completedVideos: number;
  completedOnSameDay: number;
  completionPercentage: number;
  isStreakEligible: boolean;
}

interface StreaksProps {
  completionMap: Map<string, DayCompletion>;
  scheduledDays: number[];
}

const Streaks = ({ completionMap, scheduledDays = [1, 2, 3, 4, 5] }: StreaksProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCurrentMonthRange = (): DateRange => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: startOfMonth, to: endOfMonth };
  };
  
  const [dateRange] = useState<DateRange | undefined>(getCurrentMonthRange());

  const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isScheduledDay = (date: Date): boolean => {
    const dayOfWeek = getDay(date);
    const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    return scheduledDays.includes(adjustedDay);
  };

  const getNextScheduledDay = (fromDate: Date): Date | null => {
    let checkDate = subDays(fromDate, 1);
    
    for (let i = 0; i < 7; i++) {
      if (isScheduledDay(checkDate)) return checkDate;
      checkDate = subDays(checkDate, 1);
    }
    
    return null;
  };

  const isDayStreakEligible = (date: Date): boolean => {
    const dateKey = formatDateKey(date);
    return completionMap.get(dateKey)?.isStreakEligible === true;
  };

  const calculateCurrentStreak = (): number => {
    const today = startOfDay(new Date());
    let streak = 0;
    
    const isTodayScheduled = isScheduledDay(today);
    const isTodayEligible = isDayStreakEligible(today);
    
    let startDate: Date;
    
    if (isTodayScheduled) {
      if (isTodayEligible) {
        streak = 1;
        startDate = today;
      } else {
        const lastScheduledDay = getNextScheduledDay(today);
        if (!lastScheduledDay || !isDayStreakEligible(lastScheduledDay)) return 0;
        
        streak = 1;
        startDate = lastScheduledDay;
      }
    } else {
      const lastScheduledDay = getNextScheduledDay(today);
      if (!lastScheduledDay || !isDayStreakEligible(lastScheduledDay)) return 0;
      
      streak = 1;
      startDate = lastScheduledDay;
    }
    
    let currentDate = startDate;
    
    for (let i = 0; i < 365; i++) {
      const prevScheduledDay = getNextScheduledDay(currentDate);
      if (!prevScheduledDay) break;
      
      if (isDayStreakEligible(prevScheduledDay)) {
        streak++;
        currentDate = prevScheduledDay;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateCurrentStreak();

  const completedDates = Array.from(completionMap.entries())
    .filter(([, data]) => data.isStreakEligible)
    .map(([dateStr]) => new Date(dateStr));

  const getScheduledDatesInRange = (): Date[] => {
    if (!dateRange?.from || !dateRange?.to) return [];
    
    const dates: Date[] = [];
    let currentDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    
    while (currentDate <= endDate) {
      if (isScheduledDay(currentDate)) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const scheduledDatesInRange = getScheduledDatesInRange();

  const modifiers = {
    completed: completedDates,
    scheduled: scheduledDatesInRange,
  };

  return (
    <div className='flex flex-col w-full'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex justify-between items-center font-semibold text-base hover:bg-gray-50 p-2 rounded-lg transition-colors w-full'
      >
        <div className='flex gap-2 text-sm items-center font-bold text-[#5d57ee]'>
          <FlameIcon className="text-[#5d57ee] h-5 w-5" />
          <span>Streaks</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-green-500 font-semibold'>
            {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className='mt-3 animate-in slide-in-from-top-2 duration-200'>
          <div className='mb-2 px-2'>
            <div className='flex items-center gap-4 text-xs text-gray-600'>
              <div className='flex items-center gap-1'>
                <div className='w-4 h-4 rounded-full bg-green-500'></div>
                <span>≥50% completed on time</span>
              </div>
            </div>
          </div>
          <Calendar
            mode="single"
            defaultMonth={dateRange?.from}
            className="rounded-xl border w-full"
            modifiers={modifiers}
            showOutsideDays={false}
            modifiersClassNames={{
              completed: 'rounded-full bg-green-500 text-white font-semibold',
              scheduled: 'text-blue-600',
            }}
            styles={{
              day_selected: {
                backgroundColor: 'transparent',
                color: 'inherit',
                borderRadius: '9999px',
                border: 'none',
              },
              day_today: {
                borderRadius: '9999px',
              },
              day: {
                borderRadius: '9999px',
              },
            }}
            classNames={{
              day_selected: 'rounded-full bg-green-500 text-white !outline-none !ring-0',
              day_today: 'rounded-full',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Streaks;
