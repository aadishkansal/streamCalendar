"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { VideoEvent, UseCalendarDataReturn } from '@/types/calendar';
import { generateCalendarEvents } from '../../../lib/calendar-utils';

export const useCalendarData = (projectId: string): UseCalendarDataReturn => {
  const [events, setEvents] = useState<VideoEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchAndGenerate = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const projectRes = await axios.get(`/api/schedule-project/${projectId}`);
        
        if (!projectRes.data.success) {
          throw new Error(projectRes.data.message || 'Failed to load project');
        }

        const project = projectRes.data.project;

        if (!project) {
          throw new Error('Project data is missing');
        }

        const playlistRes = await axios.get(`/api/get-playlist-videos?playlistId=${project.playlistId}`);
        const allVideos = playlistRes.data.videos || [];
        
        if (allVideos.length === 0) {
          setEvents([]);
          setLoading(false);
          return;
        }

        const selectedVideoIds = project.selectedVideos || [];
        const filteredVideos = allVideos.filter((video: any) => 
          selectedVideoIds.includes(video.id)
        );

        if (filteredVideos.length === 0) {
          setEvents([]);
          setLoading(false);
          return;
        }

        const generated: VideoEvent[] = generateCalendarEvents(project, filteredVideos);
        setEvents(generated);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load calendar data';
        setError(errorMessage);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerate();
  }, [projectId]);

  const markEventComplete = async (eventId: string) => {
    try {
      const [, indexStr] = eventId.split('-');
      const index = parseInt(indexStr, 10);

      await axios.post('/api/mark-video-as-completed', { 
        projectId,
        index 
      });

      setEvents(evts =>
        evts.map(e => (e.id === eventId ? { ...e, completed: true } : e))
      );
    } catch (err) {
      throw err;
    }
  };

  const unmarkEventComplete = async (eventId: string) => {
    try {
      const [, indexStr] = eventId.split('-');
      const index = parseInt(indexStr, 10);

      await axios.post('/api/unmark-video-as-completed', { 
        projectId,
        index 
      });

      setEvents(evts =>
        evts.map(e => (e.id === eventId ? { ...e, completed: false } : e))
      );
    } catch (err) {
      throw err;
    }
  };

  const refetch = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const projectRes = await axios.get(`/api/schedule-project/${projectId}`);
      
      if (!projectRes.data.success) {
        throw new Error(projectRes.data.message || 'Failed to load project');
      }

      const project = projectRes.data.project;
      const playlistRes = await axios.get(`/api/get-playlist-videos?playlistId=${project.playlistId}`);
      const allVideos = playlistRes.data.videos || [];
      
      const selectedVideoIds = project.selectedVideos || [];
      const filteredVideos = allVideos.filter((video: any) => 
        selectedVideoIds.includes(video.id)
      );

      if (filteredVideos.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      const generated: VideoEvent[] = generateCalendarEvents(project, filteredVideos);
      setEvents(generated);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to reload calendar data');
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    refetch,
    markEventComplete,
    unmarkEventComplete
  };
};
