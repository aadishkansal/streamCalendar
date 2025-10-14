"use client";

import React, { useEffect, useState } from "react";
import Button from "@/app/components/ui/Button";
import MultiSlotSelector from "../../components/MultiSlotSelector";
import VideoSelectionModal from "../../components/VideoSelectionModal";
import type { YplaylistType } from "@/schemas/Yplaylist";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
};

type RenderProps = {
  data: YplaylistType;
};

const Render: React.FC<RenderProps> = ({ data }) => {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    playlistId: data.playlistId,
    title: "",
    url: data.url,
    start_date: "",
    end_date: "",
    days_selected: [] as string[],
  });

  const dayLabels = [
    { short: "S", full: "Sunday" },
    { short: "M", full: "Monday" },
    { short: "T", full: "Tuesday" },
    { short: "W", full: "Wednesday" },
    { short: "T", full: "Thursday" },
    { short: "F", full: "Friday" },
    { short: "S", full: "Saturday" },
  ];

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      playlistId: data.playlistId,
      url: data.url,
    }));
  }, [data]);

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days_selected: prev.days_selected.includes(day)
        ? prev.days_selected.filter((d) => d !== day)
        : [...prev.days_selected, day],
    }));
  };

  const handleCheckboxEveryday = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      days_selected: e.target.checked ? dayLabels.map((d) => d.full) : [],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      alert("Please add a project title");
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      alert("Please select start and end dates");
      return;
    }

    if (formData.days_selected.length === 0) {
      alert("Please select at least one day");
      return;
    }

    if (selectedSlots.length === 0) {
      alert("Please add at least one time slot");
      return;
    }

    if (selectedVideos.length === 0) {
      alert("Please select at least one video");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        playlistId: formData.playlistId,
        title: formData.title,
        url: formData.url,
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
        days_selected: formData.days_selected,
        timeSlots: selectedSlots,
        selectedVideos: selectedVideos,
      };

      const response = await axios.post("/api/project-details", payload);

      if (response.data.success) {
        await update({
          projectIds: response.data.updatedProjectIds,
        });
        
        router.push("/projects?refresh=" + Date.now());
      } else {
        alert(response.data.message || "Failed to create project");
      }
    } catch (err: any) {
      console.error("Error creating project:", err);
      alert(
        err.response?.data?.message || 
        "Failed to create project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenVideoModal = () => {
    if (!formData.playlistId) {
      alert("Playlist ID is missing!");
      return;
    }
    setShowVideoModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white drop-shadow-xl rounded-xl w-full max-w-[560px] mx-auto min-h-[850px] gap-5 p-4 sm:p-6">
      <img
        src={data.thumbnail}
        alt={data.title}
        className="rounded-2xl w-full h-[180px] sm:h-[240px] object-cover"
      />

      <div className="text-center w-full">
        <h2 className="text-lg sm:text-xl font-bold px-2">{data.title}</h2>
        <p className="text-sm sm:text-base text-gray-500 font-medium">{data.channelName}</p>
      </div>

      <input
        className="w-full border-b-2 p-2 border-blue-500 focus:outline-none text-sm sm:text-base"
        type="text"
        placeholder="Add project title"
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full text-sm">
        <span className="font-medium whitespace-nowrap">Date:</span>
        <input
          type="date"
          className="focus:outline-[#5d57ee] border rounded-xl px-2 py-1 w-full sm:w-auto"
          value={formData.start_date}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              start_date: e.target.value,
            }))
          }
        />
        <span className="font-medium whitespace-nowrap">To:</span>
        <input
          type="date"
          className="focus:outline-[#5d57ee] border rounded-xl px-2 py-1 w-full sm:w-auto"
          value={formData.end_date}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              end_date: e.target.value,
            }))
          }
        />
      </div>

      <div className="w-full">
        <MultiSlotSelector selectedSlots={selectedSlots} onChange={setSelectedSlots} />
      </div>

      <div className="w-full flex justify-between items-center">
        <button
          type="button"
          onClick={handleOpenVideoModal}
          className="px-4 py-2 bg-[#5d57ee] text-white text-sm sm:text-base rounded-full hover:bg-[#5d57ee]/80 transition"
        >
          Select Videos ({selectedVideos.length})
        </button>
      </div>

      <div className="flex items-center gap-2 w-full flex-wrap">
        <span className="font-medium text-sm sm:text-base mr-2 w-full sm:w-auto">Repeat on:</span>
        <div className="flex gap-2 flex-wrap">
          {dayLabels.map(({ short, full }, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleDay(full)}
              className={`w-9 h-9 rounded-full border text-sm font-semibold transition-colors ${
                formData.days_selected.includes(full)
                  ? "bg-[#5d57ee] text-white border-transparent"
                  : "border-black text-black hover:bg-gray-100"
              }`}
            >
              {short}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-center w-full">
        <input
          type="checkbox"
          className="appearance-none border border-black rounded-full size-5 checked:bg-[#5D57EE] focus:outline-none focus:ring-0 cursor-pointer"
          checked={formData.days_selected.length === 7}
          onChange={handleCheckboxEveryday}
        />
        <label className="font-normal text-sm sm:text-base">Every Day</label>
      </div>

      <Button
        type="button"
        title={isSubmitting ? "Creating..." : "Create Project"}
        variant="btn_big1"
        onClick={handleSubmit}
        disabled={isSubmitting}
      />

      {showVideoModal && (
        <VideoSelectionModal
          playlistId={formData.playlistId}
          selected={selectedVideos}
          onClose={() => setShowVideoModal(false)}
          onSave={setSelectedVideos}
        />
      )}
    </div>
  );
};

export default Render;
