import React from 'react'
import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { type DateRange } from "react-day-picker"
import { format, parseISO } from "date-fns"
import { FlameIcon } from 'lucide-react'

interface StreaksProps {
  completionMap: Map<string, boolean>
}

const Streaks = ({ completionMap }: StreaksProps) => {
  const getCurrentMonthRange = (): DateRange => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0) // last day of the month
    return {
      from: startOfMonth,
      to: endOfMonth,
    }
  }
  
  // Set initial state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getCurrentMonthRange())

  // Convert Map to array of [date, completed], sorted
  const sortedDates = Array.from(completionMap.entries())
    .map(([date, completed]) => [new Date(date), completed] as [Date, boolean])
    .sort(([a], [b]) => a.getTime() - b.getTime())

  // Calculate current streak
  let currentStreak = 0
  for (let [, completed] of sortedDates) {
    if (completed) {
      currentStreak++
    } else {
      break
    }
  }

  // Highlight completed (true) dates in green
  const modifiers = {
    completed: sortedDates.filter(([, completed]) => completed).map(([date]) => date),
  }

  const modifiersClassNames = {
    completed: 'rounded-full bg-green-500 text-white hover:bg-green-600 ',
  }

  return (
    <div className='flex flex-col text-white gap-2 space-x-2'>
      <div className='flex justify-between font-semibold  text-base '>
        <div className='flex gap-2 text-sm items-center '>
          <FlameIcon/>
          Streaks
        </div>
        <div className='text-sm '>
          {currentStreak} Days
        </div>
      </div>

      <div>
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          className="rounded-xl"
          modifiers={modifiers}
          showOutsideDays={false}
          modifiersClassNames={modifiersClassNames}
        />
      </div>
    </div>
  )
}

export default Streaks
