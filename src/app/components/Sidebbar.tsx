import React from 'react'
import Streaks from './Streaks'
// from-[#5d57ee] to-[#5652b3] 
interface SidebarProps {
  completionMap: Map<string, boolean>
}
const Sidebbar = (data: SidebarProps) => {
  return (
    <div className="h-[684px] w-72 p-2 mr-auto flex flex-col bg-gradient-to-r from-[#5d57ee]/90 to-[#353188]/90 shadow-lg rounded-xl">
  <div className="mt-3  bg-white/5 backdrop-blur-md rounded-xl p-2 flex flex-col gap-3">
    <div className="text-white font-['Inter'] font-semibold text-base flex gap-2 items-center">
      <img src="/homelogo.svg" alt="Home" /> <span>Home</span>
    </div>
    <div className="text-white font-['Inter'] font-semibold text-base flex gap-2 items-center">
      <img src="/CALENDAR.svg" alt="Schedule" /> <span>Schedule</span>
    </div>
  </div>

           
        <div className='mt-3  bg-white/5 backdrop-blur-md rounded-xl p-2  '>
          <Streaks completionMap={data.completionMap}  />
        </div>

        <div className=" mt-auto  bg-white/5 backdrop-blur-md rounded-xl flex flex-col gap-3 px-2 py-2 mb-3 ">
          <div className="text-white font-['inter'] font-semibold flex  gap-4 items-center">
            <img src="/help.svg" />  
          <span>Help Center</span> 
          </div >
          <div className="text-white font-['inter'] font-semibold flex  gap-3 items-center">
            <img src="/setting.svg" />  
          <span>Settings</span> 
          
          </div>
        </div>
    </div>
  )
}

export default Sidebbar