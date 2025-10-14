"use client";
import React, { useState, useEffect } from "react";
import MultiSlotSelector from "../components/MultiSlotSelector";
import Button from "@/app/components/ui/Button";

type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
};

type EditScheduleModalProps = {
  currentSlots: TimeSlot[];
  currentDays: string[];
  currentStartDate: string;
  currentEndDate: string;
  projectId: string;
  onClose: () => void;
  onUpdated: (updateData: { slots: TimeSlot[]; days: string[]; startDate: string; endDate: string; }) => void;
};

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  currentSlots,
  currentDays,
  currentStartDate,
  currentEndDate,
  projectId,
  onClose,
  onUpdated,
}) => {
  // ✅ Ensure all slots have unique IDs
  const normalizeSlots = (slots: TimeSlot[]): TimeSlot[] => {
    return slots.map((slot, index) => ({
      ...slot,
      id: slot.id || `slot-${Date.now()}-${index}`
    }));
  };

  const [slots, setSlots] = useState<TimeSlot[]>(() => normalizeSlots(currentSlots));
  const [selectedDays, setSelectedDays] = useState<string[]>(currentDays);
  const [startDate, setStartDate] = useState(currentStartDate);
  const [endDate, setEndDate] = useState(currentEndDate);
  const [loading, setLoading] = useState(false);

  // ✅ Update slots when currentSlots change
  useEffect(() => {
    setSlots(normalizeSlots(currentSlots));
  }, [currentSlots]);

  const dayLabels = [
    { short: "S", full: "Sunday" },
    { short: "M", full: "Monday" },
    { short: "T", full: "Tuesday" },
    { short: "W", full: "Wednesday" },
    { short: "T", full: "Thursday" },
    { short: "F", full: "Friday" },
    { short: "S", full: "Saturday" },
  ];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSelectAllDays = (checked: boolean) => {
    setSelectedDays(checked ? dayLabels.map((d) => d.full) : []);
  };

  const handleSubmit = async () => {
    if (slots.length === 0) {
      alert("Please add at least one time slot");
      return;
    }

    if (selectedDays.length === 0) {
      alert("Please select at least one day");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/update-project-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          timeSlots: slots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime
          })),
          days_selected: selectedDays,
          start_date: new Date(startDate),
          end_date: new Date(endDate),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onUpdated({
          slots,
          days: selectedDays,
          startDate,
          endDate,
        });
        onClose();
      } else {
        alert(data.message || "Failed to update schedule");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Failed to update schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Edit Project Schedule</h3>

        <div className="mb-6">
          <label className="block font-medium mb-2">Project Duration</label>
          <div className="flex gap-3 items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-xl px-3 py-2"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-xl px-3 py-2"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">Repeat on Days</label>
          <div className="flex items-center gap-2 mb-2">
            {dayLabels.map(({ short, full }) => (
              <button
                key={full}
                type="button"
                onClick={() => toggleDay(full)}
                className={`w-10 h-10 rounded-full border text-sm font-semibold transition-colors ${
                  selectedDays.includes(full)
                    ? "bg-[#5d57ee] text-white"
                    : "border-gray-400 text-gray-700"
                }`}
              >
                {short}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedDays.length === 7}
              onChange={(e) => handleSelectAllDays(e.target.checked)}
            />
            <span className="text-sm">Every Day</span>
          </label>
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">Time Slots</label>
          <MultiSlotSelector selectedSlots={slots} onChange={setSlots} />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            title="Cancel"
            className="bg-slate-100 px-3 py-2 hover:text-red-500"
            onClick={onClose}
          />
          <Button
            type="button"
            title={loading ? "Updating..." : "Update"}
            variant="btn_purple"
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default EditScheduleModal;
