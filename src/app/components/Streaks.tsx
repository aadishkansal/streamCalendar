import React from 'react'
import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { type DateRange } from "react-day-picker"
import { format, parseISO } from "date-fns"

interface StreaksProps {
  completionMap: Map<string, boolean>
}

const Streaks = ({ completionMap }: StreaksProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 7, 13),
    to: new Date(2025, 7, 26),
  })

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
    completed: 'bg-green-500 text-white hover:bg-green-600',
  }

  return (
    <div className='flex flex-col text-white gap-2 space-x-2'>
      <div className='flex justify-between font-semibold text-base '>
        <div className='flex gap-2 items-center '>
          <img src="/streaks.svg" alt="streaks" />
          Streaks
        </div>
        <div>
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
          modifiersClassNames={modifiersClassNames}
        />
      </div>
    </div>
  )
}

export default Streaks
