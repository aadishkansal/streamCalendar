"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@/app/components/ui/Button";

type VideoSelectionModalProps = {
  playlistId: string;
  selected: string[];
  onSave: (ids: string[]) => void;
  onClose: () => void;
};

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
};

const VideoSelectionModal: React.FC<VideoSelectionModalProps> = ({
  playlistId,
  selected,
  onSave,
  onClose,
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [checked, setChecked] = useState<string[]>(selected);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/get-playlist-videos?playlistId=${playlistId}`);
        
        if (response.data.success && response.data.videos) {
          setVideos(response.data.videos);
        } else {
          setError('Failed to load videos');
        }
      } catch (err: any) {
        console.error('Error fetching videos:', err);
        setError(err.response?.data?.message || 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchVideos();
    }
  }, [playlistId]);

  const toggle = (id: string) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allVideoIds = videos.map(v => v.id);
    setChecked(allVideoIds);
  };

  const handleDeselectAll = () => {
    setChecked([]);
  };

  const handleSave = () => {
    onSave(checked);
    onClose();
  };

  const allSelected = videos.length > 0 && checked.length === videos.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 overflow-auto max-h-[80vh]">
        <h3 className="text-lg font-bold mb-4">Select Videos</h3>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Loading videos...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No videos found in this playlist
          </div>
        )}

        {!loading && !error && videos.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {videos.length} videos available | <span className="font-semibold text-purple-600">{checked.length} selected</span>
              </div>
              <button
                onClick={allSelected ? handleDeselectAll : handleSelectAll}
                className="text-sm font-medium text-purple-600 hover:text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {videos.map((vid, index) => (
                <label
                  key={vid.id || index}
                  className="flex items-center border rounded-xl p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                >
              <input
  type="checkbox"
  checked={checked.includes(vid.id)}
  onChange={() => toggle(vid.id)}
  className="mr-3 accent-[#5d57ee] cursor-pointer"
/>
                  {vid.thumbnail ? (
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-16 h-12 object-cover mr-3 rounded-xl"
                    />
                  ) : (
                    <div className="w-16 h-12 bg-gray-200 mr-3 rounded-xl flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" title={vid.title}>
                      {vid.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-gray-500">{vid.duration}</p>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <Button title="Cancel" className="bg-[#5d57ee]/10 hover:text-red-500 px-4 py-1" onClick={onClose} type="button" />
          <Button 
            title={`Select ${checked.length}`} 
            variant="btn_purple" 
            onClick={handleSave} 
            type="button"
            disabled={loading}

          />
        </div>
      </div>
    </div>
  );
};

export default VideoSelectionModal;
