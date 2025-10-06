import React from 'react'
import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { type DateRange } from "react-day-picker"
import { startOfDay, subDays, getDay } from "date-fns"
import { FlameIcon, ChevronDown, ChevronUp } from 'lucide-react'

interface StreaksProps {
  completionMap: Map<string, { completed: boolean; completedOn?: string }>;
  scheduledDays: number[];
}

const Streaks = ({ completionMap, scheduledDays = [1, 2, 3, 4, 5] }: StreaksProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCurrentMonthRange = (): DateRange => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return {
      from: startOfMonth,
      to: endOfMonth,
    }
  }
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getCurrentMonthRange())

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
  }

  const calculateCurrentStreak = (): number => {
    const today = startOfDay(new Date());
    let streak = 0;
    
    const isTodayScheduled = isScheduledDay(today);
    const todayKey = formatDateKey(today);
    const todayData = completionMap.get(todayKey);
    
    // STRICT: Only count if timestamp exists AND matches scheduled date
    const isTodayCompletedOnTime = todayData?.completed && 
      todayData.completedOn !== undefined && 
      todayData.completedOn === todayKey;
    
    if (isTodayScheduled) {
      if (isTodayCompletedOnTime) {
        streak = 1;
        let checkDate = subDays(today, 1);
        
        for (let i = 0; i < 365; i++) {
          if (isScheduledDay(checkDate)) {
            const dateKey = formatDateKey(checkDate);
            const data = completionMap.get(dateKey);
            
            // STRICT: Only count if timestamp exists AND matches
            const completedOnTime = data?.completed && 
              data.completedOn !== undefined && 
              data.completedOn === dateKey;
            
            if (completedOnTime) {
              streak++;
              checkDate = subDays(checkDate, 1);
            } else {
              break;
            }
          } else {
            checkDate = subDays(checkDate, 1);
          }
        }
      } else {
        // Today not completed yet, count from yesterday
        let checkDate = subDays(today, 1);
        
        for (let i = 0; i < 365; i++) {
          if (isScheduledDay(checkDate)) {
            const dateKey = formatDateKey(checkDate);
            const data = completionMap.get(dateKey);
            
            // STRICT: Only count if timestamp exists AND matches
            const completedOnTime = data?.completed && 
              data.completedOn !== undefined && 
              data.completedOn === dateKey;
            
            if (completedOnTime) {
              streak++;
              checkDate = subDays(checkDate, 1);
            } else {
              break;
            }
          } else {
            checkDate = subDays(checkDate, 1);
          }
        }
      }
    } else {
      // Today not scheduled, count from yesterday
      let checkDate = subDays(today, 1);
      
      for (let i = 0; i < 365; i++) {
        if (isScheduledDay(checkDate)) {
          const dateKey = formatDateKey(checkDate);
          const data = completionMap.get(dateKey);
          
          // STRICT: Only count if timestamp exists AND matches
          const completedOnTime = data?.completed && 
            data.completedOn !== undefined && 
            data.completedOn === dateKey;
          
          if (completedOnTime) {
            streak++;
            checkDate = subDays(checkDate, 1);
          } else {
            break;
          }
        } else {
          checkDate = subDays(checkDate, 1);
        }
      }
    }
    
    return streak;
  };

  const currentStreak = calculateCurrentStreak();

  const completedDates = Array.from(completionMap.entries())
    .filter(([, data]) => data.completed)
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
  }

  const modifiersClassNames = {
    completed: 'rounded-full bg-green-500 text-white hover:bg-green-600 font-semibold',
    scheduled: 'rounded-full border-2 border-blue-300 text-blue-600',
  }

  return (
    <div className='flex flex-col'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex justify-between items-center font-semibold text-base hover:bg-gray-50 p-2 rounded-lg transition-colors -mx-2'
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
                <span>Completed</span>
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-4 h-4 rounded-full border-2 border-blue-300'></div>
                <span>Scheduled</span>
              </div>
            </div>
          </div>
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-xl border"
            modifiers={modifiers}
            showOutsideDays={false}
            modifiersClassNames={modifiersClassNames}
          />
        </div>
      )}
    </div>
  )
}

export default Streaks
