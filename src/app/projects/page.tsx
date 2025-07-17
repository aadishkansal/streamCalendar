"use client"

// add a check, because the front-end is rendering when the values are not yet available

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import MainNavbar from '../components/MainNavBar';
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  dateStart: string;
  dateEnd: string;
  completed: boolean;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/get-projects');
      const data = response.data;
      if (data.success) {
        setProjects(data.projects);
      } else {
        setError(data.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError('Error fetching projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/calendar/${projectId}`);
  };
   const [completionMap, setCompletionMap] = useState<Map<string, boolean>>(new Map())

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-[#5d57ee] mb-4" />
      <p className="text-gray-600 font-medium">Loading your projects...</p>
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="text-center py-12">
      <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={fetchProjects}
        className="px-4 py-2 bg-[#5d57ee] text-white rounded-lg hover:bg-[#4a45d1] transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Main projects list view
  return (
    <div className='flex justify-center  ml-2'>
        <MainNavbar/>
    <div className="flex justify-items-center h-screen mt-20 gap-2">
    {/* <Sidebbar completionMap={completionMap} /> */}
    
      <div className="max-w-7xl  mx-auto px-4 py-6 shadow-2xl rounded-xl bg-white ">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600 font-medium ">Manage and track your learning projects</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage />
        ) : projects.length === 0 ? (
          <div className="md:min-w-[700px] text-center py-12 ">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h2>
            <p className="text-gray-600">Create your first project to get started</p>
          </div>
        ) : (
          <div className="grid gap-6  md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => handleProjectClick(project._id)}
                className="bg-gradient-to-r from-[#5d57ee] to-[#353188]  rounded-2xl shadow-xl hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                      {project.title}
                    </h3>
                    <div className="flex-shrink-0 ml-2">
                      {project.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <Clock className="h-6 w-6 text-yellow-500" />
                      )}
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
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.completed ? 'Completed' : 'In Progress'}
                    </span>
                    <button className="text-white px-1 ml-1 hover:text-cyan-400 text-sm font-medium transition-colors">
                      View Calendar →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Projects;