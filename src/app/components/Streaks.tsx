import React from 'react'


const Streaks = () => {
  return (
    <div className='flex flex-col text-white space-x-2'>
      <div className='flex justify-between font-semibold text-base '>
        <div className='flex gap-2 items-center '>
       <img src="/streaks.svg" alt="streaks" />
       Streaks</div>
        <div>
          5 Days
        </div>
      </div>
      <div>
      calender 
      </div>
    </div>
  )
}

export default Streaks