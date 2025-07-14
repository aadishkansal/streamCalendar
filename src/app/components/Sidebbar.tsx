import React from 'react'
import Streaks from './Streaks'
// from-[#5d57ee] to-[#5652b3] 
import { usePathname } from 'next/navigation'
import { CalendarIcon, HelpCircleIcon, HomeIcon, NewspaperIcon, SettingsIcon } from 'lucide-react'
interface SidebarProps {
  completionMap: Map<string, boolean>
}
const Sidebbar = (data: SidebarProps) => {
  const pathname = usePathname();
  return (
    <div className="h-[684px] w-72 p-2 mr-auto flex flex-col bg-gradient-to-r from-[#5d57ee]/90 to-[#353188]/90 shadow-lg rounded-xl">
  <div className="mt-3  bg-white/5 backdrop-blur-md rounded-xl p-2 flex flex-col gap-3">
  <div className="text-white font-['Inter'] font-semibold text-sm">
  <a href='/' className="flex gap-2 items-center"> 
    <HomeIcon/>
    <span>Home</span>
  </a>
</div>

<div className="text-white font-['Inter'] font-semibold text-sm">
<a href={pathname && pathname.startsWith('/calendar/') ? pathname : '/calendar/'} className="flex gap-2 items-center">  
    <CalendarIcon/>
    <span>My Schedule</span>
  </a>
</div>

<div className="text-white font-['Inter'] font-semibold text-sm">
  <a href='/projects' className="flex gap-2 items-center"> 
    <NewspaperIcon/>
    <span>Projects</span>
  </a>
</div>
    
  </div>

           
        <div className='mt-3  bg-white/5 backdrop-blur-md rounded-xl p-2  '>
          <Streaks completionMap={data.completionMap}  />
        </div>

        <div className=" mt-auto  bg-white/5 backdrop-blur-md rounded-xl flex flex-col gap-3 px-2 py-2 mb-3 ">
          <div className="text-white font-['inter'] font-semibold flex text-sm gap-4 items-center">
<HelpCircleIcon/>
         <a href='/support'> <span>Help & Support</span> </a>
          </div >
          <div className="text-white font-['inter'] font-semibold flex text-sm gap-3 items-center">
<SettingsIcon/>
         <a href='/settings'> <span>Settings</span> </a>
          
          </div>
        </div>
    </div>
  )
}

export default Sidebbar