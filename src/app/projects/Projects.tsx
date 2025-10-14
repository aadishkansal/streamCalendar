"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Edit2,
  ArrowLeft,
} from "lucide-react";
import MainNavbar from "../components/MainNavBar";
import axios from "axios";
import { useSession } from "next-auth/react";
import EditScheduleModal from "@/app/components/EditScheduleModal";

type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
};

interface Project {
  _id: string;
  title: string;
  dateStart: string;
  dateEnd: string;
  completed: boolean;
  timeSlots?: TimeSlot[];
  days_selected?: string[];
  selectedVideos?: any[];
  playlistId?: string;
  events?: any[];
  completion_timestamps?: string[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProj, setEditingProj] = useState<Project | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  useEffect(() => {
    fetchProjects();
  }, [session?.user?.projectIds]);

  useEffect(() => {
    const refreshParam = searchParams.get("refresh");
    if (refreshParam) fetchProjects();
  }, [searchParams]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/get-projects");
      
      if (data.success) {
        const projectsWithEvents = await Promise.all(
          data.projects.map(async (proj: Project) => {
            try {
              const projectResponse = await axios.get(`/api/schedule-project/${proj._id}`);
              
              if (!projectResponse.data?.success) {
                return proj;
              }
              
              const projectData = projectResponse.data.project;
              
              if (!projectData.playlistId) {
                return { ...proj, events: [] };
              }
              
              const playlistResponse = await axios.get(`/api/get-playlist-videos?playlistId=${projectData.playlistId}`);
              
              const allVideos = playlistResponse.data.videos || [];
              
              if (allVideos.length === 0) {
                return { ...proj, events: [] };
              }
              
              const selectedVideoIds = projectData.selectedVideos || [];
              const filteredVideos = allVideos.filter((video: any) => 
                selectedVideoIds.includes(video.id)
              );
              
              if (filteredVideos.length === 0) {
                return { ...proj, events: [] };
              }
              
              const { generateCalendarEvents } = await import('@/lib/calendar-utils');
              const generatedEvents = generateCalendarEvents(projectData, filteredVideos);
              
              return {
                ...proj,
                events: generatedEvents,
                completion_timestamps: projectData.completion_timestamps || []
              };
            } catch (err) {
              console.error(`Error processing ${proj.title}:`, err);
              return proj;
            }
          })
        );
        
        setProjects(projectsWithEvents);
      } else {
        setError(data.message || "Failed to fetch projects");
      }
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError("Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectCompletion = (project: Project) => {
    if (!project.events || project.events.length === 0) {
      return {
        totalVideos: project.selectedVideos?.length || 0,
        completedVideos: 0,
        completionPercentage: 0,
        isComplete: false
      };
    }

    const totalVideos = project.events.length;
    const completedVideos = project.events.filter((e: any) => e.completed).length;
    const completionPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

    return {
      totalVideos,
      completedVideos,
      completionPercentage: Math.round(completionPercentage),
      isComplete: completedVideos === totalVideos && totalVideos > 0
    };
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/calendar/${projectId}`);
  };

  const handleBack = () => {
    router.back();
  };

  const openEdit = (e: React.MouseEvent, proj: Project) => {
    e.stopPropagation();
    setEditingProj(proj);
  };

  const handleUpdated = (updateData: {
    slots: TimeSlot[];
    days: string[];
    startDate: string;
    endDate: string;
  }) => {
    setProjects((prev) =>
      prev.map((p) =>
        p._id === editingProj!._id
          ? {
              ...p,
              timeSlots: updateData.slots,
              days_selected: updateData.days,
              dateStart: updateData.startDate,
              dateEnd: updateData.endDate,
            }
          : p
      )
    );
    setEditingProj(null);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getSortedTimeSlots = (slots: TimeSlot[] = []) => {
    return [...slots].sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    });
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-[#5d57ee] mb-4" />
      <p className="text-gray-600 font-medium">Loading your projects...</p>
    </div>
  );

  const ErrorMessage = () => (
    <div className="text-center py-12">
      <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={fetchProjects}
        className="px-4 py-2 bg-[#5d57ee] text-white rounded-lg hover:bg-[#4a45d1]"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="flex justify-center ml-2">
      <MainNavbar />
      <div className="flex justify-items-center min-h-screen mt-20 gap-2 w-full">
        <div className="max-w-7xl w-full mx-auto px-4 py-6 shadow-2xl rounded-xl bg-white max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#5d57ee] hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              My Projects
            </h1>
            <p className="text-gray-600 font-medium">
              Manage and track your learning projects
            </p>
          </div>

          {loading ? (
            <div className="md:min-w-[700px]">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <ErrorMessage />
          ) : projects.length === 0 ? (
            <div className="md:min-w-[700px] text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No projects yet
              </h2>
              <p className="text-gray-600">
                Create your first project to get started
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const sortedSlots = getSortedTimeSlots(project.timeSlots);
                const completion = calculateProjectCompletion(project);
                
                return (
                  <div
                    key={project._id}
                    onClick={() => handleProjectClick(project._id)}
                    className="relative bg-gradient-to-r from-[#5d57ee] to-[#353188] rounded-2xl shadow-xl hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white line-clamp-2">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {completion.isComplete ? (
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          ) : (
                            <Clock className="h-6 w-6 text-yellow-400" />
                          )}
                          <button
                            onClick={(e) => openEdit(e, project)}
                            className="text-white hover:text-cyan-400 transition-colors"
                            title="Edit Schedule"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-white">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Start: {formatDate(project.dateStart)}</span>
                        </div>
                        <div className="flex items-center text-sm text-white">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>End: {formatDate(project.dateEnd)}</span>
                        </div>
                        {sortedSlots.length > 0 && (
                          <div className="text-sm text-white">
                            <Clock className="h-4 w-4 inline mr-2" />
                            <span className="font-medium">
                              {sortedSlots.length} time slot(s):
                            </span>
                            <div className="ml-6 mt-1 space-y-1">
                              {sortedSlots.map((slot, index) => (
                                <div key={slot.id || index} className="text-xs">
                                  {formatTime(slot.startTime)} -{" "}
                                  {formatTime(slot.endTime)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-white font-medium">
                            Progress: {completion.completionPercentage}%
                          </span>
                          <span className="text-xs text-white">
                            {completion.completedVideos}/{completion.totalVideos}
                          </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${completion.completionPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            completion.isComplete
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {completion.isComplete ? "Completed" : "In Progress"}
                        </span>
                        <button className="text-white px-1 ml-1 hover:text-cyan-400 text-sm font-medium transition-colors">
                          View Calendar →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {editingProj && (
        <EditScheduleModal
          currentSlots={editingProj.timeSlots || []}
          currentDays={editingProj.days_selected || []}
          currentStartDate={editingProj.dateStart}
          currentEndDate={editingProj.dateEnd}
          projectId={editingProj._id}
          onClose={() => setEditingProj(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
};

export default Projects;
