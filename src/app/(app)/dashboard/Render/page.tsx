"use client";
import React, { useEffect, useState } from "react";
import Button from "@/app/components/ui/Button";
import { YplaylistType } from "@/schemas/Yplaylist";
import axios from "axios";

type RenderProps = {
  data: YplaylistType;
};

const Render: React.FC<RenderProps> = ({ data }) => {
  const [formData, setFormData] = useState({
    playlistId: data.playlistId,
    title: "",
    url: data.url,
    start_date: "",
    end_date: "",
    time_slot_start: "",
    time_slot_end: "",
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
    if (data?.playlistId) {
      setFormData(prev => ({
        ...prev,
        playlistId: data.playlistId,
        url: data.url,
      }));
    }
  }, [data]);

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      days_selected: prev.days_selected.includes(day)
        ? prev.days_selected.filter((d) => d !== day)
        : [...prev.days_selected, day],
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof formData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleCheckboxEveryday = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        days_selected: dayLabels.map((d) => d.full),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        days_selected: [],
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(formData)
      const response = await axios.post("/api/project-details", {
        ...formData,
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
      });

      console.log("✅ Success:", response.data);
    } catch (err) {
      console.error("❌ API Error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white drop-shadow-xl rounded-xl w-[520px] h-[740px] gap-5 p-6">
      <div>
        <img src={data.thumbnail} alt={data.title} className="rounded-2xl mt-4 w-full h-[240px] place-items-center " />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold break-before-auto">{data.title}</h2>
        <p className="text-gray-500 font-medium">{data.channelName}</p>
      </div>

      <div className="flex flex-col mb-1 gap-3 w-full">
        <input
          className="border-b-2 p-2 border-blue-500 font-normal focus:outline-none focus:ring-0"
          type="text"
          placeholder="Add title"
          value={formData.title}
          onChange={(e) => handleInputChange(e, "title")}
        />
        <div className="flex gap-2 items-center">
          Date: From:
          <input
            type="date"
            className="focus:outline-none focus:ring-0"
            value={formData.start_date}
            onChange={(e) => handleInputChange(e, "start_date")}
          />
          To:
          <input
            type="date"
            className="focus:outline-none focus:ring-0"
            value={formData.end_date}
            onChange={(e) => handleInputChange(e, "end_date")}
          />
        </div>
        <div className="flex gap-2 mt-1  items-center">
          Time Slot:
          <input
            type="time"
            className="focus:outline-none focus:ring-0"
            value={formData.time_slot_start}
            onChange={(e) => handleInputChange(e, "time_slot_start")}
          />
          To:
          <input
            type="time"
            className="focus:outline-none focus:ring-0"
            value={formData.time_slot_end}
            onChange={(e) => handleInputChange(e, "time_slot_end")}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mr-auto ">
        Repeat on:
        {dayLabels.map(({ short, full }, index) => (
          <button
            key={index}
            type="button"
            onClick={() => toggleDay(full)}
            className={`w-9 h-9 rounded-full border text-sm font-semibold transition-colors ${
              formData.days_selected.includes(full)
                ? "bg-[#5d57ee] text-white border-transparent"
                : "border-black text-black"
            }`}
          >
            {short}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-1 mr-auto items-center">
  <input
    type="checkbox"
    className="appearance-none border border-black rounded-full size-5 checked:bg-[#5D57EE] focus:outline-none focus:ring-0"
    checked={formData.days_selected.length === 7}
    onChange={handleCheckboxEveryday}
  />
  <label className="font-normal">Every Day</label>
</div>

      <Button type="submit" title="Create" variant="btn_big1" onClick={handleSubmit} />
    </div>
  );
};

export default Render;