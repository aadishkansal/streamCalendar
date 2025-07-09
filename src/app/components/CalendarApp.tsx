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

  const generateCalendarEvents = (project: Project, videos: PlaylistVideo[]): VideoEvent[] => {
    if (!project || !videos.length) return []
    
    const events: VideoEvent[] = []
    // Use the correct field names from your model
    const startDate = new Date(project.start_date)
    const endDate = new Date(project.end_date)
    
    // Convert day names to numbers (0 = Sunday, 1 = Monday, etc.)
    const dayNameToNumber = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    }
    
    // Use the correct field name from your model
    const selectedDayNumbers = project.days_selected.map(day => 
      dayNameToNumber[day as keyof typeof dayNameToNumber]
    )
    
    let currentDate = new Date(startDate)
    let videoIndex = 0
    
    while (currentDate <= endDate && videoIndex < videos.length) {
      const dayOfWeek = currentDate.getDay()
      
      if (selectedDayNumbers.includes(dayOfWeek)) {
        const video = videos[videoIndex]
        
        // Create start and end datetime strings using correct field names
        const startDateTime = new Date(currentDate)
        const [startHour, startMinute] = project.time_slot_start.split(':').map(Number)
        startDateTime.setHours(startHour, startMinute, 0, 0)
        
        const endDateTime = new Date(currentDate)
        const [endHour, endMinute] = project.time_slot_end.split(':').map(Number)
        endDateTime.setHours(endHour, endMinute, 0, 0)
        
        // Check if this video is completed based on the streak array
        const isCompleted = project.streak && project.streak.length > videoIndex 
          ? project.streak[videoIndex] 
          : false
        
        events.push({
          id: `${project._id}-${videoIndex}-${currentDate.toISOString().split('T')[0]}`,
          title: isCompleted ? `✅ ${video.title}` : `📹 ${video.title}`,
          description: `Video ${videoIndex + 1} of ${videos.length}`,
          start: startDateTime.toISOString().slice(0, 16).replace('T', ' '),
          end: endDateTime.toISOString().slice(0, 16).replace('T', ' '),
          videoId: videoIndex.toString(), // Use index as videoId since videos don't have individual IDs
          playlistUrl: `https://www.youtube.com/playlist?list=${project.playlistId}`,
          videoUrl: video.url,
          isCompleted: isCompleted
        })
        
        videoIndex++
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return events
  }

  const markVideoAsCompleted = async (videoId: string) => {
    try {
      // videoId is the index in string format
      const videoIndex = parseInt(videoId)
      
      if (isNaN(videoIndex) || videoIndex < 0 || videoIndex >= videos.length) {
        console.error('Invalid video index')
        return
      }

      const response = await axios.post(`/api/mark-video-as-completed`, {
        index: videoIndex,
        projectId
      });
      
      if (response.status === 200 && response.data.success) {
        // Update local state
        setCalendarEvents(prev => 
          prev.map(event => 
            event.videoId === videoId 
              ? { ...event, isCompleted: true, title: `✅ ${event.title.replace('📹 ', '')}` }
              : event
          )
        );

        // Update project state to reflect the change
        setProject(prev => {
          if (!prev) return prev
          const newStreak = [...(prev.streak || [])]
          newStreak[videoIndex] = true
          return { ...prev, streak: newStreak }
        })
      }
    } catch (error) {
      console.error('Error marking video as done:', error);
    }
  };

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: calendarEvents,
    selectedDate: project?.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '2025-07-09',
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

  return (
    <div className="flex justify-center mt-24 font-semibold font-inter ">
      <div className="sx-calendar-container">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>
    </div>
  )
}

export default CalendarApp