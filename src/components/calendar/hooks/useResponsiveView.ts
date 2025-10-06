import { useState, useEffect } from 'react';
import { CalendarView, MobileView, DesktopView } from '@/types/calendar';

interface UseResponsiveViewReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentView: CalendarView;
  setView: (view: CalendarView) => void;
  getAvailableViews: () => CalendarView[];
}

export const useResponsiveView = (initialView?: CalendarView): UseResponsiveViewReturn => {
  // Default to 'week' for desktop, 'day' for mobile
  const getDefaultView = (): CalendarView => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) {
        return 'day'; // Mobile default
      }
      return 'week'; // Desktop/Tablet default
    }
    return initialView || 'week'; // Default to week if no window
  };

  const [currentView, setCurrentView] = useState<CalendarView>(getDefaultView());
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });

      // Auto-adjust view based on screen size
      if (width < 768) { // Mobile
        if (currentView === 'week' || currentView === 'month') {
          setCurrentView('day');
        }
      } else { // Desktop/Tablet
        if (currentView === 'day' || currentView === '3day') {
          setCurrentView('week'); // Changed from 'month' to 'week'
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial call
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [currentView]);

  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isDesktop = screenSize.width >= 1024;

  const setView = (view: CalendarView) => {
    // Validate view is appropriate for current screen size
    if (isMobile && (view === 'week' || view === 'month')) {
      return; // Don't allow these views on mobile
    }
    if (!isMobile && (view === 'day' || view === '3day')) {
      // Allow but not recommended
    }
    setCurrentView(view);
  };

  const getAvailableViews = (): CalendarView[] => {
    if (isMobile) {
      return ['day', '3day'] as CalendarView[];
    }
    return ['week', 'month'] as CalendarView[];
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    currentView,
    setView,
    getAvailableViews
  };
};
