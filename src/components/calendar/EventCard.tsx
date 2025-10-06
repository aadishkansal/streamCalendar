'use client';

import React, { useState } from 'react';
import { VideoEvent } from '@/types/calendar';
import { formatDuration, getEventColor, isEventOverdue } from '@/lib/calendar-utils';
import { Play, Clock, Check, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: VideoEvent;
  onMarkComplete: (eventId: string) => Promise<void>;
  onEventClick?: (event: VideoEvent) => void;
  compact?: boolean;
  showDate?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onMarkComplete,
  onEventClick,
  compact = false,
  showDate = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.completed || isLoading) return;

    try {
      setIsLoading(true);
      await onMarkComplete(event.id);
    } catch (error) {
      console.error('Failed to mark event as complete:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.videoUrl) {
      window.open(event.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardClick = () => {
    if (compact) {
      setIsExpanded(!isExpanded);
    } else {
      onEventClick?.(event);
    }
  };

  const eventColor = getEventColor(event);
  const isOverdue = isEventOverdue(event);
  
  if (compact) {
    return (
      <div
        className={`
          ${eventColor} text-white rounded-lg p-3 mb-2 cursor-pointer
          transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
          ${isExpanded ? 'ring-2 ring-white ring-opacity-50' : ''}
        `}
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{event.title}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="h-3 w-3" />
              <span className="text-xs opacity-90">
                {formatDuration(event.duration)}
              </span>
              {showDate && (
                <>
                  <span className="text-xs opacity-60">•</span>
                  <span className="text-xs opacity-90">
                    {format(event.scheduledDate, 'MMM d')}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-2">
            {event.completed ? (
              <div className="bg-white bg-opacity-20 rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            ) : (
              <button
                onClick={handleMarkComplete}
                disabled={isLoading}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 transition-colors"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
            )}
            
            {compact && (
              <button className="opacity-60">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white border-opacity-20">
            <p className="text-xs opacity-90 mb-3 line-clamp-2">
              {event.description || 'No description available'}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-xs opacity-80">
                <div>Project: {event.projectName}</div>
                {event.scheduledTime && (
                  <div className="mt-1">Time: {event.scheduledTime}</div>
                )}
                {isOverdue && !event.completed && (
                  <div className="mt-1 text-yellow-200">⚠️ Overdue</div>
                )}
              </div>
              
              <button
                onClick={handleVideoClick}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-1 text-xs font-medium transition-colors flex items-center space-x-1"
              >
                <Play className="h-3 w-3" />
                <span>Watch</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full event card for desktop
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer
        transform transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5
        ${event.completed ? 'border-green-300' : ''}
        ${isOverdue && !event.completed ? 'border-red-300' : ''}
      `}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {event.title}
          </h3>
          <div className="text-sm text-gray-600">
            {event.projectName}
          </div>
        </div>
        
        <div className={`
          w-3 h-3 rounded-full flex-shrink-0 ml-2
          ${eventColor.replace('bg-', 'bg-')}
        `} />
      </div>

      {event.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {event.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(event.duration)}</span>
          </div>
          
          {showDate && (
            <div>
              {format(event.scheduledDate, 'MMM d, h:mm a')}
            </div>
          )}
          
          {event.scheduledTime && (
            <div>{event.scheduledTime}</div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {event.videoUrl && (
            <button
              onClick={handleVideoClick}
              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
              title="Watch Video"
            >
              <Play className="h-4 w-4" />
            </button>
          )}
          
          {event.completed ? (
            <div className="text-green-600 p-1">
              <Check className="h-4 w-4" />
            </div>
          ) : (
            <button
              onClick={handleMarkComplete}
              disabled={isLoading}
              className="text-gray-400 hover:text-green-600 p-1 rounded transition-colors"
              title="Mark as Complete"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {isOverdue && !event.completed && (
        <div className="mt-3 pt-3 border-t border-red-200">
          <div className="text-xs text-red-600 flex items-center space-x-1">
            <span>⚠️</span>
            <span>This video is overdue</span>
          </div>
        </div>
      )}
    </div>
  );
};