"use client";

import React, { useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { YplaylistType } from "@/schemas/Yplaylist";
import Render from "./Render/page";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface Props {
  userName: string;
}

export default function DashboardClient({ userName }: Props) {
  const [playList, setPlaylist] = useState<YplaylistType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    const url = inputRef.current?.value?.trim();
    if (!url) return;

    try {
      const response = await axios.post("/api/generate-details", { url });
      const { data: resData } = response;
      const combinedData = {
        ...resData.data,
        url,
      };
      setPlaylist(combinedData);
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        setLoading(false);
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Fetch error:", axiosError.response?.data.message ?? "Something went wrong.");
    }
  };

  return (<>
    <Navbar/>
    <div className="flex flex-col items-center justify-center gap-6 px-4 pt-72">
      <div className="text-white text-center">
        <h1 className="text-5xl font-bold drop-shadow-md font-['Inter']">
          Welcome {userName}, schedule your YouTube playlist
        </h1>
        <p className="mt-4 text-base font-normal">
          Automatically schedule your playlist, track your progress, and stay motivated!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center w-full max-w-3xl mt-6">
        <input
          ref={inputRef}
          type="search"
          placeholder="Enter the playlist link"
          className="flex-grow p-3 rounded-s-full text-black w-full sm:w-auto"
        />
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-[#5d57ee] to-[#353188] w-full sm:w-[140px] h-[51px] rounded-e-full text-white font-semibold text-base mt-4 sm:mt-0"
        >
          Generate
        </button>
      </div>

      <div ref={sectionRef} className="w-screen bg-white mt-64 py-20 flex flex-col items-center justify-center">
  {loading && (
    <div className="flex flex-col items-center justify-center gap-4 ">
      <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-[#5D57EE] rounded-full"></div>
      <p className="text-lg text-gray-700">Generating your schedule...</p>
    </div>
  )}
  
  {!loading && playList && (
    <Render data={playList} />
  )}
</div>
      <Footer/>
    </div>
    </>
  );
}