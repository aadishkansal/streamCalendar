"use client";

import React, { useState, useRef } from "react";
import Button from "./ui/Button";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { YplaylistType } from "@/schemas/Yplaylist";
import Render from "./Render";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    const url = inputRef.current?.value?.trim();

    if (!url) {
      console.warn("Please enter a playlist URL");
      return;
    }

    router.replace("/sign-up");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-r from-[#5d57ee]/90 to-purple-400 gap-6 px-4">
      <div className="text-white text-center">
        <h1 className="text-5xl font-bold drop-shadow-md font-['Inter']">
          Use AI to schedule your YouTube playlist <br /> automatically
        </h1>
        <p className="mt-4 text-base font-normal">
          Take control of your learning and entertainment journey with{" "}
          <strong className="text-black">StreamCalendar</strong>. Automatically
          schedule your playlist, track your progress, and stay motivated with
          streaks!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center w-full max-w-3xl mt-6">
        <input
          ref={inputRef}
          type="search"
          placeholder="Enter the playlist link"
          className="flex-grow p-3 rounded-s-full sm:rounded-s-full sm:rounded-e-none text-black w-full sm:w-auto"
        />
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-[#5d57ee] to-[#353188] w-full sm:w-[140px] h-[51px] rounded-e-full text-white font-semibold text-base mt-4 sm:mt-0"
        >
          Generate
        </button>
      </div>

    </div>
  );
};

export default Hero;