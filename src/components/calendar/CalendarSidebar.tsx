'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { VideoEvent } from '../../types/calendar';
import { DesktopCalendar } from './DesktopCalendar';
import { CalendarView } from '../../types/calendar';
import MainNavbar from '@/app/components/MainNavBar';
import { IconHome, IconBrandTabler, IconSettings, IconUserBolt, IconArrowLeft, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import Streaks from '@/app/components/Streaks';
import { CalendarArrowDown, HourglassIcon } from 'lucide-react';

interface CalendarSidebarProps {
  events: VideoEvent[];
  currentDate: Date;
  view: 'week' | 'month';
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onEventComplete: (eventId: string, shouldUnmark?: boolean) => Promise<void>;
  onEventClick: (event: VideoEvent) => void;
}

const mainLinks = [
  {
    label: 'Home',
    href: '/',
    icon: <IconHome className="h-5 w-5 shrink-0 text-[#5d57ee]" />
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-[#5d57ee]" />
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <IconSettings className="h-5 w-5 shrink-0 text-[#5d57ee]" />
  }
];

const footerLinks = [
  {
    label: 'Help & Support',
    href: '/support',
    icon: <IconUserBolt className="h-5 w-5 shrink-0 text-[#5d57ee]" />
  },
  {
    label: 'Logout',
    href: '#',
    icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-[#5d57ee]" />
  }
];

const convertToNumberArray = (days: any[]): number[] => {
  if (!days || !Array.isArray(days)) return [1, 2, 3, 4, 5];

  const dayMap: { [key: string]: number } = {
    'monday': 1, 'mon': 1,
    'tuesday': 2, 'tue': 2,
    'wednesday': 3, 'wed': 3,
    'thursday': 4, 'thu': 4,
    'friday': 5, 'fri': 5,
    'saturday': 6, 'sat': 6,
    'sunday': 7, 'sun': 7
  };

  return days.map(day => {
    if (typeof day === 'number') return day;
    if (typeof day === 'string') {
      const normalized = day.toLowerCase().trim();
      return dayMap[normalized] || 0;
    }
    return 0;
  }).filter(day => day > 0);
};

// Helper function to format date consistently
const formatDateKey = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const CalendarSidebar: React.FC<CalendarSidebarProps> = (props) => {
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(false);
  const [isPastUncompletedExpanded, setIsPastUncompletedExpanded] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [scheduledDayNumbers, setScheduledDayNumbers] = useState<number[]>([1, 2, 3, 4, 5]);

  const projectId = props.events[0]?.projectId;

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`/api/schedule-project/${projectId}`);
        if (response.data.success) {
          const project = response.data.project;
          setProjectData(project);
          
          const convertedDays = convertToNumberArray(project.days_selected || []);
          setScheduledDayNumbers(convertedDays);
        }
      } catch (error) {
        console.error('Error fetching project ', error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const completionMap = useMemo(() => {
    const map = new Map<string, { completed: boolean; completedOn?: string }>();
    
    props.events.forEach((event, index) => {
      const dateKey = formatDateKey(event.scheduledDate);
      
      // Get completion timestamp from project data if available
      const completionTimestamp = projectData?.completion_timestamps?.[index];
      
      map.set(dateKey, {
        completed: event.completed,
        completedOn: completionTimestamp ? formatDateKey(new Date(completionTimestamp)) : undefined
      });
    });
    
    return map;
  }, [props.events, projectData]);
  
  const upcomingEvents = props.events
    .filter(e => !e.completed && new Date(e.scheduledDate) >= new Date())
    .slice(0, 5);

  const pastUncompletedEvents = props.events
    .filter(e => !e.completed && new Date(e.scheduledDate) < new Date())
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
    .slice(0, 5);

  return (
    <>
      <div className='flex justify-center ml-4'>
        <MainNavbar />
      </div>

      <div className="flex h-screen bg-[#5d57ee]/10 pt-20">
        <div className="w-80 bg-white rounded-xl ml-1 border-r border-gray-200 flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col gap-1">
                {mainLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#5d57ee] hover:text-white hover:bg-[#5d57ee]/50 transition-colors"
                  >
                    {link.icon}
                    <span className="text-sm font-bold">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <HourglassIcon className="h-5 w-5 text-[#5d57ee]" />
                <h3 className="text-sm font-bold text-[#5d57ee]">Progress</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {props.events.filter(e => e.completed).length}
                  </div>
                  <div className="text-xs font-medium text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {props.events.filter(e => !e.completed).length}
                  </div>
                  <div className="text-xs font-medium text-gray-500">Pending</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <Streaks 
                completionMap={completionMap}
                scheduledDays={scheduledDayNumbers}
              />
            </div>

            <div className="border-b border-gray-200">
              <button
                onClick={() => setIsPastUncompletedExpanded(!isPastUncompletedExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
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
                <div className="px-6 pb-6 space-y-2">
                  {pastUncompletedEvents.length > 0 ? (
                    pastUncompletedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors border border-red-100"
                        onClick={() => props.onEventClick(event)}
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

            <div className="border-b border-gray-200">
              <button
                onClick={() => setIsUpcomingExpanded(!isUpcomingExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
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
                <div className="px-6 pb-6 space-y-2">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100"
                        onClick={() => props.onEventClick(event)}
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

          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col gap-1">
              {footerLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#5d57ee] hover:text-white hover:bg-[#5d57ee]/50 transition-colors"
                >
                  {link.icon}
                  <span className="text-sm font-bold">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 h-[calc(100vh-5rem)]">
          <DesktopCalendar {...props} />
        </div>
      </div>
    </>
  );
};
