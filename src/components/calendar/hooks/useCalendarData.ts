"use client"
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
        
        const response = await axios.get(`/api/schedule-project/${projectId}`);
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to load project');
        }

        const { project, videos } = response.data;

        if (!project) {
          throw new Error('Project data is missing');
        }

        if (!videos || videos.length === 0) {
          console.warn('No videos found for this project');
          setEvents([]);
          setLoading(false);
          return;
        }

        const generated: VideoEvent[] = generateCalendarEvents(project, videos);
        setEvents(generated);
      } catch (err: any) {
        console.error('Error loading calendar:', err);
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
      
      const response = await axios.get(`/api/schedule-project/${projectId}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load project');
      }

      const { project, videos } = response.data;

      if (!videos || videos.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      const generated: VideoEvent[] = generateCalendarEvents(project, videos);
      setEvents(generated);
    } catch (err: any) {
      console.error('Error refetching calendar:', err);
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
