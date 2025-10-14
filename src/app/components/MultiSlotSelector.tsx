"use client";
import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";

type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
};

type MultiSlotSelectorProps = {
  selectedSlots: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
};

const MultiSlotSelector: React.FC<MultiSlotSelectorProps> = ({
  selectedSlots = [],
  onChange,
}) => {
  const [tempStart, setTempStart] = useState("");
  const [tempEnd, setTempEnd] = useState("");
  const [error, setError] = useState("");

  // Convert time string (HH:MM) to minutes since midnight
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const addSlot = () => {
    // Clear previous error
    setError("");

    if (!tempStart || !tempEnd) {
      setError("Please select both start and end times");
      return;
    }

    const startMinutes = timeToMinutes(tempStart);
    const endMinutes = timeToMinutes(tempEnd);

    // Check if it's the same time
    if (startMinutes === endMinutes) {
      setError("End time must be different from start time");
      return;
    }

    // Allow overnight slots (e.g., 23:00 to 00:30)
    const isOvernightSlot = endMinutes < startMinutes;

    if (isOvernightSlot) {
      setError("Time slot crosses midnight (overnight). Please adjust your times.");
      return;
    }

    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: tempStart,
      endTime: tempEnd,
    };

    onChange([...selectedSlots, newSlot]);
    setTempStart("");
    setTempEnd("");
    setError(""); // Clear error on success
  };

  const removeSlot = (id: string) => {
    onChange(selectedSlots.filter((slot) => slot.id !== id));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Check if both times are filled
  const isBothTimesFilled = tempStart && tempEnd;

  return (
    <div className="w-full space-y-4">
      {/* Time Input Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Time:</span>
          <input
            type="time"
            value={tempStart}
            onChange={(e) => {
              setTempStart(e.target.value);
              setError(""); // Clear error on input change
            }}
            className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-gray-600">-</span>
          <input
            type="time"
            value={tempEnd}
            onChange={(e) => {
              setTempEnd(e.target.value);
              setError(""); // Clear error on input change
            }}
            className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="button"
          onClick={addSlot}
          className={`p-2 text-white rounded-full transition ${
            isBothTimesFilled
              ? "bg-green-600 hover:bg-green-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          title={isBothTimesFilled ? "Add time slot" : "Fill both times"}
        >
          {isBothTimesFilled ? (
            <Check className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Selected Slots Display */}
      {selectedSlots.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected Time Slots:</p>
          <div className="flex flex-wrap gap-2">
            {selectedSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center gap-2 bg-indigo-100 rounded-xl text-indigo-800 px-3 py-2"
              >
                <span className="text-sm font-medium">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
                <button
                  type="button"
                  onClick={() => removeSlot(slot.id)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message - Below slots */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {selectedSlots.length === 0 && !error && (
        <p className="text-sm text-gray-500 italic">
          No time slots added yet. Add your first time slot above.
        </p>
      )}
    </div>
  );
};

export default MultiSlotSelector;
