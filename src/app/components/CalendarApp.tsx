"use client"
import React, { useState, useEffect } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import { createEventRecurrencePlugin } from "@schedule-x/event-recurrence";
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
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const eventModal = createEventModalPlugin()
  const [project, setProject] = useState<Project | null>(null)
  const [videos, setVideos] = useState<PlaylistVideo[]>([])
  const [calendarEvents, setCalendarEvents] = useState<VideoEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [completionMap, setCompletionMap] = useState<Map<string, boolean>>(new Map())

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
      const date = event.start.split(' ')[0] // Extract YYYY-MM-DD
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
  

  // Helper function to convert UTC date to local date string (YYYY-MM-DD)
  const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Helper function to create ScheduleX compatible datetime string
  const createScheduleXDateTime = (date: Date, timeString: string): string => {
    const dateStr = getLocalDateString(date)
    const [hours, minutes] = timeString.split(':').map(Number)
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    return `${dateStr} ${timeStr}`
  }

  // Helper function to create custom content with interactive elements
  const createCustomContent = (video: PlaylistVideo, videoIndex: number, isCompleted: boolean, totalVideos: number): string => {
    const checkboxId = `video-checkbox-${videoIndex}`
    const linkId = `video-link-${videoIndex}`

    return `
     <div className="mt-2 pt-2 border-t border-gray-200">
  <div className="mb-2">
    <strong>Video ${videoIndex + 1} of ${totalVideos}</strong>
  </div>
</div>
       <div className="mb-2">
  <button
    onclick="window.open('${video.url}', '_blank', 'noopener,noreferrer')"
    id="${linkId}"
    className="text-blue-600 font-medium border border-blue-600 px-3 py-1 mt-2 rounded-md hover:underline hover:bg-blue-50 transition"
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
            style="
              width: 16px; 
              height: 16px; 
              cursor: pointer;
              accent-color: #1976d2;
            "
          />
          <label 
            for="${checkboxId}" 
            style="
              cursor: pointer; 
              font-weight: 500;
              color: ${isCompleted ? '#4caf50' : '#666'};
            "
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
    // Convert UTC dates to local dates
    const startDate = new Date(project.start_date)
    const endDate = new Date(project.end_date)
    
    // Convert day names to numbers (0 = Sunday, 1 = Monday, etc.)
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
        
        // Create ScheduleX compatible datetime strings
        const startDateTime = createScheduleXDateTime(currentDate, project.time_slot_start)
        const endDateTime = createScheduleXDateTime(currentDate, project.time_slot_end)
        
        // Check if this video is completed based on the streak array
        const isCompleted = project.streak && project.streak.length > videoIndex 
          ? project.streak[videoIndex] 
          : false
        
        // Clean description without URL
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
        
          // Rebuild completion map after updating events
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
  
  // Add global function to handle checkbox changes
  useEffect(() => {
    (window as any).handleVideoCompletion = (videoIndex: string, isChecked: boolean) => {
      toggleVideoMark(videoIndex, isChecked)
    }
  
    return () => {
      delete (window as any).handleVideoCompletion
    }
  }, [videos, project])  // ✅ corrected 'projected' to 'project'
  

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: calendarEvents,
    selectedDate: project?.start_date ? getLocalDateString(new Date(project.start_date)) : '2025-07-09',
    plugins: [
      eventsService,
      eventModal,
      createCurrentTimePlugin(),
      createDragAndDropPlugin(),
      createResizePlugin(),
      createEventRecurrencePlugin()
    ],
  })

  useEffect(() => {
    if (calendarEvents.length > 0) {
      eventsService.set(calendarEvents)
    }
  }, [calendarEvents, eventsService])

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-24">
        <div className="text-lg font-semibold">Loading calendar...</div>
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

  return (<div className='flex justify-center bg-wh w-screen h-screen' >
  <MainNavbar/>
  
    <div className="flex justify-center gap-2 mt-20 right-0 font-semibold font-inter ">
    <Sidebbar completionMap={completionMap} />
      <div className="sx-calendar-container">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
    </div>
  )
}

export default CalendarApp