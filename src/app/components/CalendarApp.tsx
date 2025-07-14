"use client"

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthGrid,
  createViewWeek,
  createViewMonthAgenda,
} from '@schedule-x/calendar'
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createEventRecurrencePlugin } from "@schedule-x/event-recurrence"
import '@schedule-x/theme-default/dist/index.css'
import axios from 'axios'
import MainNavbar from './MainNavBar'
import Sidebbar from './Sidebbar'

interface CalendarAppProps {
    projectId: string
}

interface VideoEvent {
    id: string
    title: string
    description?: string
    start: string
    end: string
    videoId: string
    playlistUrl: string
    videoUrl: string
    isCompleted: boolean
    _customContent?: {
        timeGrid?: string
        dateGrid?: string
        monthGrid?: string
        monthAgenda?: string
    }
}

interface Project {
    _id: string
    user_id: string
    playlistId: string
    title: string
    start_date: Date
    end_date: Date
    time_slot_start: string
    time_slot_end: string
    days_selected: string[]
    streak?: boolean[]
    completed: boolean
    createdAt: Date
    updatedAt: Date
}

interface PlaylistVideo {
    title: string
    url: string
}

interface Playlist {
    _id: string
    playlistId: string
    title: string
    description?: string
    url: string
    thumbnail: string
    totalVideos: number
    totalDuration: string
    channelName: string
    videos: PlaylistVideo[]
    createdAt: Date
    updatedAt: Date
}

interface APIResponse {
    success: boolean
    message: string
    project: Project
    videos: Playlist  
}

const CalendarApp: React.FC<CalendarAppProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null)
  const [videos, setVideos] = useState<PlaylistVideo[]>([])
  const [calendarEvents, setCalendarEvents] = useState<VideoEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [completionMap, setCompletionMap] = useState<Map<string, boolean>>(new Map())
  const [shouldHideSidebar, setShouldHideSidebar] = useState(false)
  const [currentView, setCurrentView] = useState('week')
  const [screenWidth, setScreenWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth
    }
    return 1024
  })

  // Create plugins once and reuse
  const eventsServiceRef = useRef(createEventsServicePlugin())
  const eventModalRef = useRef(createEventModalPlugin())
  const currentTimeRef = useRef(createCurrentTimePlugin())
  const dragDropRef = useRef(createDragAndDropPlugin())
  const resizeRef = useRef(createResizePlugin())
  const recurrenceRef = useRef(createEventRecurrencePlugin())
  const controlsRef = useRef(createCalendarControlsPlugin())

  // Utility functions
  const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const createScheduleXDateTime = (date: Date, timeString: string): string => {
    const dateStr = getLocalDateString(date)
    const [hours, minutes] = timeString.split(':').map(Number)
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    return `${dateStr} ${timeStr}`
  }

  const createScheduleXEndDateTime = (date: Date, startTimeString: string, endTimeString: string): string => {
    const [startHours, startMinutes] = startTimeString.split(':').map(Number)
    const [endHours, endMinutes] = endTimeString.split(':').map(Number)
    
    const startTimeInMinutes = startHours * 60 + startMinutes
    const endTimeInMinutes = endHours * 60 + endMinutes
    
    let finalEndHours = endHours
    let finalEndMinutes = endMinutes
    let endDate = new Date(date)
    
    if (endHours === 0 && endMinutes === 0) {
      if (startHours >= 12) {
        finalEndHours = 23
        finalEndMinutes = 59
      } else {
        endDate.setDate(endDate.getDate() + 1)
        finalEndHours = 0
        finalEndMinutes = 0
      }
    } else if (endTimeInMinutes <= startTimeInMinutes) {
      endDate.setDate(endDate.getDate() + 1)
    }
    
    const dateStr = getLocalDateString(endDate)
    const timeStr = `${String(finalEndHours).padStart(2, '0')}:${String(finalEndMinutes).padStart(2, '0')}`
    return `${dateStr} ${timeStr}`
  }

  const createCustomContent = (video: PlaylistVideo, videoIndex: number, isCompleted: boolean, totalVideos: number): string => {
    const checkboxId = `video-checkbox-${videoIndex}`
    const linkId = `video-link-${videoIndex}`

    return `
      <div class="mt-2 pt-2 border-t border-gray-200">
        <div class="mb-2">
          <strong>Video ${videoIndex + 1} of ${totalVideos}</strong>
        </div>
        <div class="mb-2">
          <button
            onclick="window.open('${video.url}', '_blank', 'noopener,noreferrer')"
            id="${linkId}"
            class="text-blue-600 font-medium border border-blue-600 px-3 py-1 mt-2 rounded-md hover:underline hover:bg-blue-50 transition"
          >
            Watch Video
          </button>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <input 
            type="checkbox" 
            id="${checkboxId}"
            ${isCompleted ? 'checked' : ''}
            onchange="handleVideoCompletion('${videoIndex}', this.checked)"
            style="width: 16px; height: 16px; cursor: pointer; accent-color: #1976d2;"
          />
          <label 
            for="${checkboxId}" 
            style="cursor: pointer; font-weight: 500; color: ${isCompleted ? '#4caf50' : '#666'};"
          >
            ${isCompleted ? '✅ Completed' : 'Mark as Done'}
          </label>
        </div>
      </div>
    `
  }

  const generateCalendarEvents = (project: Project, videos: PlaylistVideo[]): VideoEvent[] => {
    if (!project || !videos.length) return []
    
    const events: VideoEvent[] = []
    const startDate = new Date(project.start_date)
    const endDate = new Date(project.end_date)
    
    const dayNameToNumber = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    }
    
    const selectedDayNumbers = project.days_selected.map(day => 
      dayNameToNumber[day as keyof typeof dayNameToNumber]
    )
    
    let currentDate = new Date(startDate)
    let videoIndex = 0
    
    while (currentDate <= endDate && videoIndex < videos.length) {
      const dayOfWeek = currentDate.getDay()
      
      if (selectedDayNumbers.includes(dayOfWeek)) {
        const video = videos[videoIndex]
        
        const startDateTime = createScheduleXDateTime(currentDate, project.time_slot_start)
        const endDateTime = createScheduleXEndDateTime(currentDate, project.time_slot_start, project.time_slot_end)
        
        const isCompleted = project.streak && project.streak.length > videoIndex 
          ? project.streak[videoIndex] 
          : false
        
        const description = `Video ${videoIndex + 1} of ${videos.length}\n\nScheduled learning session for: ${video.title}`
        
        events.push({
          id: `${project._id}-${videoIndex}-${getLocalDateString(currentDate)}`,
          title: isCompleted ? `✅ ${video.title}` : `📹 ${video.title}`,
          description: description,
          start: startDateTime,
          end: endDateTime,
          videoId: videoIndex.toString(),
          playlistUrl: `https://www.youtube.com/playlist?list=${project.playlistId}`,
          videoUrl: video.url,
          isCompleted: isCompleted,
          _customContent: {
            timeGrid: createCustomContent(video, videoIndex, isCompleted, videos.length),
            dateGrid: createCustomContent(video, videoIndex, isCompleted, videos.length),
            monthGrid: createCustomContent(video, videoIndex, isCompleted, videos.length),
            monthAgenda: createCustomContent(video, videoIndex, isCompleted, videos.length)
          }
        })
        
        videoIndex++
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return events
  }

  // Navigation functions
  const goToPrevious = () => {
    if (controlsRef.current) {
      const currentDate = new Date(controlsRef.current.getDate())
      const currentView = controlsRef.current.getView()
      
      let newDate: Date
      
      switch (currentView) {
        case 'day':
          newDate = new Date(currentDate)
          newDate.setDate(currentDate.getDate() - 1)
          break
        case 'week':
          newDate = new Date(currentDate)
          newDate.setDate(currentDate.getDate() - 7)
          break
        case 'month-grid':
        case 'month-agenda':
          newDate = new Date(currentDate)
          newDate.setMonth(currentDate.getMonth() - 1)
          break
        default:
          newDate = new Date(currentDate)
          newDate.setDate(currentDate.getDate() - 1)
      }
      
      controlsRef.current.setDate(getLocalDateString(newDate))
    }
  }

  const goToNext = () => {
    if (controlsRef.current) {
      const currentDate = new Date(controlsRef.current.getDate())
      const currentView = controlsRef.current.getView()
      
      let newDate: Date
      
      switch (currentView) {
        case 'day':
          newDate = new Date(currentDate)
          newDate.setDate(currentDate.getDate() + 1)
          break
        case 'week':
          newDate = new Date(currentDate)
          newDate.setDate(currentDate.getDate() + 7)
          break
        case 'month-grid':
        case 'month-agenda':
          newDate = new Date(currentDate)
          newDate.setMonth(currentDate.getMonth() + 1)
          break
        default:
          newDate = new Date(currentDate)
          newDate.setDate(currentDate.getDate() + 1)
      }
      
      controlsRef.current.setDate(getLocalDateString(newDate))
    }
  }

  const goToToday = () => {
    if (controlsRef.current) {
      controlsRef.current.setDate(new Date().toISOString().split('T')[0])
    }
  }

  // Create calendar configuration based on screen size
  const calendarConfig = useMemo(() => {
    const isSmallScreen = screenWidth < 700
    const defaultView = isSmallScreen ? 'day' : 'week'
    
    return {
      views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
      ],
      defaultView,
      events: calendarEvents,
      selectedDate: project?.start_date
        ? getLocalDateString(new Date(project.start_date))
        : '2025-07-09',
      plugins: [
        eventsServiceRef.current,
        eventModalRef.current,
        currentTimeRef.current,
        dragDropRef.current,
        resizeRef.current,
        recurrenceRef.current,
        controlsRef.current,
      ],
    }
  }, [screenWidth, calendarEvents, project])

  const calendar = useCalendarApp(calendarConfig)

  // Handle screen size changes and update view accordingly
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setScreenWidth(width)
      setShouldHideSidebar(width < 992)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Sync currentView state with screen size changes
  useEffect(() => {
    const isSmallScreen = screenWidth < 700
    const defaultView = isSmallScreen ? 'day' : 'week'
    setCurrentView(defaultView)
    
    // Also set the calendar view if controls are available
    if (controlsRef.current) {
      controlsRef.current.setView(defaultView)
    }
  }, [screenWidth])

  // Ensure currentView is synced when calendar initializes
  useEffect(() => {
    if (calendar && controlsRef.current) {
      const actualView = controlsRef.current.getView()
      if (actualView !== currentView) {
        setCurrentView(actualView)
      }
    }
  }, [calendar])

  // Update events when they change
  useEffect(() => {
    if (calendar && calendarEvents.length > 0) {
      eventsServiceRef.current.set(calendarEvents)
    }
  }, [calendar, calendarEvents])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dropdown = document.querySelector('.sx-header select')
      if (dropdown && dropdown.parentElement?.className.includes('sx-header-view-select')) {
        dropdown.parentElement.remove()
      }
    })
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/schedule-project/${projectId}`)
        const apiResponse: APIResponse = response.data
        if (apiResponse.success) {
          setProject(apiResponse.project)
          setVideos(apiResponse.videos.videos)
          const generatedEvents = generateCalendarEvents(apiResponse.project, apiResponse.videos.videos)
          setCalendarEvents(generatedEvents)
        } else {
          console.error('API Error:', apiResponse.message)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [projectId])

  const buildCompletionMap = (events: VideoEvent[]): Map<string, boolean> => {
    const map = new Map<string, boolean>()
    events.forEach(event => {
      const date = event.start.split(' ')[0]
      if (!map.has(date)) {
        map.set(date, true)
      }
      if (!event.isCompleted) {
        map.set(date, false)
      }
    })
    return map
  }
  
  useEffect(() => {
    if (calendarEvents.length > 0) {
      setCompletionMap(buildCompletionMap(calendarEvents))
    }
  }, [calendarEvents])

  const toggleVideoMark = async (videoId: string, isChecked: boolean) => {
    try {
      const videoIndex = parseInt(videoId)
      
      if (isNaN(videoIndex)) {
        console.error('Invalid video index')
        return
      }
  
      const endpoint = isChecked ? '/api/mark-video-as-completed' : '/api/unmark-video-as-completed'
  
      const response = await axios.post(endpoint, {
        index: videoIndex,
        projectId
      })
  
      if (response.status === 200 && response.data.success) {
        setCalendarEvents(prev => {
          const updatedEvents = prev.map(event => {
            if (event.videoId === videoId) {
              const updatedEvent = {
                ...event,
                isCompleted: isChecked,
                title: isChecked
                  ? `✅ ${event.title.replace('📹 ', '').replace('✅ ', '')}`
                  : `📹 ${event.title.replace('✅ ', '').replace('📹 ', '')}`,
                _customContent: {
                  timeGrid: createCustomContent({ title: event.title, url: event.videoUrl }, videoIndex, isChecked, prev.length),
                  dateGrid: createCustomContent({ title: event.title, url: event.videoUrl }, videoIndex, isChecked, prev.length),
                  monthGrid: createCustomContent({ title: event.title, url: event.videoUrl }, videoIndex, isChecked, prev.length),
                  monthAgenda: createCustomContent({ title: event.title, url: event.videoUrl }, videoIndex, isChecked, prev.length)
                }
              }
              return updatedEvent
            }
            return event
          })
        
          setCompletionMap(buildCompletionMap(updatedEvents))
          return updatedEvents
        })        
  
        setProject(prev => {
          if (!prev) return prev
          const newStreak = [...(prev.streak || [])]
          newStreak[videoIndex] = isChecked
          return { ...prev, streak: newStreak }
        })
      }
    } catch (error) {
      console.error(`Error ${isChecked ? 'marking' : 'unmarking'} video:`, error)
    }
  }
  
  useEffect(() => {
    (window as any).handleVideoCompletion = (videoIndex: string, isChecked: boolean) => {
      toggleVideoMark(videoIndex, isChecked)
    }
  
    return () => {
      delete (window as any).handleVideoCompletion
    }
  }, [toggleVideoMark])

  useEffect(() => {
    if (calendarEvents.length > 0) {
      eventsServiceRef.current.set(calendarEvents)
    }
  }, [calendarEvents])

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-24">
        <div className="text-lg font-semibold justify-center">Loading calendar...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center mt-24">
        <div className="text-lg font-semibold text-red-500">Project not found</div>
      </div>
    )
  }

  return (
    <div className='flex justify-center bg-white w-screen h-screen ml-2'>
      <MainNavbar/>
      
      <div className="flex justify-center gap-2 mt-20 right-0 font-semibold font-inter">
        
        {!shouldHideSidebar && (
          <Sidebbar completionMap={completionMap} />
        )}
        
        <div className="sx-calendar-container">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .sx__view-selection-selected-item {
                  display: none !important;
                }
                
                .sx__today-button{
                 display: none !important;
                }
                
                .sx__forward-backward-navigation{
                 display: none !important;
                }
                
                .nav-arrow {
                  background: #f8f9fa;
                  border: 1px solid #dee2e6;
                  border-radius: 6px;
                  padding: 8px 12px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-width: 40px;
                  height: 40px;
                }
                
                .nav-arrow:hover {
                  background: #e9ecef;
                  border-color: #adb5bd;
                }
                
                .nav-arrow:active {
                  background: #dee2e6;
                  transform: translateY(1px);
                }
                
                .nav-arrow svg {
                  width: 16px;
                  height: 16px;
                  color: #495057;
                }
                
                .today-btn {
                  background: #007bff;
                  color: white;
                  border: 1px solid #007bff;
                  border-radius: 6px;
                  padding: 8px 16px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  font-size: 14px;
                  font-weight: 500;
                }
                
                .today-btn:hover {
                  background: #0056b3;
                  border-color: #0056b3;
                }
                
                @media (max-width: 640px) {
                  .calendar-controls {
                    flex-wrap: wrap;
                    gap: 8px;
                  }
                  
                  .nav-arrow {
                    min-width: 36px;
                    height: 36px;
                    padding: 6px 10px;
                  }
                  
                  .today-btn {
                    padding: 6px 12px;
                    font-size: 13px;
                  }
                }
              `
            }}
          />

          {/* Calendar Controls */}
          <div className="mb-4 flex items-center justify-between calendar-controls">
            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={goToPrevious}
                className="nav-arrow"
                title="Previous"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={goToNext}
                className="nav-arrow"
                title="Next"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                onClick={goToToday}
                className="today-btn"
                title="Go to Today"
              >
                Today
              </button>
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-3">
              <label htmlFor="view-select" className="font-medium">View:</label>
              <select
                id="view-select"
                value={currentView}
                onChange={(e) => {
                  const newView = e.target.value
                  setCurrentView(newView)
                  controlsRef.current.setView(newView)
                }}
                className="border px-3 py-1 rounded-md bg-white shadow-sm"
              >
                {screenWidth < 700 ? (
                  <>
                    <option value="day">Day</option>
                    <option value="month-agenda">Month Agenda</option>
                  </>
                ) : (
                  <>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month-grid">Month</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Calendar View */}
          {calendar && <ScheduleXCalendar calendarApp={calendar} />}
        </div>
      </div>
    </div>
  )
}

export default CalendarApp