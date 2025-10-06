"use client";

import React, { useState, useRef, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { YplaylistType } from "@/schemas/Yplaylist";
import Render from "./Render/render";
import { useSession } from "next-auth/react";

import MainNavbar from "@/app/components/MainNavBar";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Footer from "../components/Footer";
interface Props {
  userName: string;
}

export default function DashboardClient({ userName }: Props) {
  const [playList, setPlaylist] = useState<YplaylistType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [usedCredits, setUsedCredits] = useState<number>(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.projectIds) {
      setUsedCredits(session.user.projectIds.length);
    }
  }, [session]);

  const handleSubmit = async () => {
    const url = inputRef.current?.value?.trim();
    if (!url) return;

    if (usedCredits >= 2) {
      console.log("Buy our premium");
      return;
    }

    setLoading(true);
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
        sectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 2000);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error(
        "Fetch error:",
        axiosError.response?.data.message ?? "Something went wrong."
      );
      setLoading(false);
    }
  };

  // Check if button should be disabled
  const isButtonDisabled =
    usedCredits >= 2 || loading || !inputRef.current?.value?.trim();
  const remainingCredits = Math.max(0, 2 - usedCredits);

  return (
    <div className="w-screen">
      {/* Main content with gradient covering full viewport */}

      <div className="flex justify-center w-screen ml-2">
        <MainNavbar />
      </div>
      <BackgroundBeamsWithCollision>
        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-5xl space-y-8 font-black text-center text-[#5d57ee]/80 dark:text-white font-sans tracking-tight">
          Welcome {userName}, use AI to automatically schedule your YouTube
          playlist. <br />
          <div className="text-sm md:text-xl mt-4 text-slate-500 font-medium font-['inter']">
            Take control of your learning and entertainment journey with
          </div>
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
              <span>StreamCalendar</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              <span>StreamCalendar</span>
            </div>
          </div>
          <div className="text-white text-center">
            <p className="text-sm">
              {usedCredits >= 2 ? (
                <span className="text-red-400 text-base font-semibold">
                  No credits remaining. Upgrade to premium for unlimited access!
                </span>
              ) : (
                <span></span>
              )}
            </p>
          </div>
          <div className="flex text-base font-normal flex-col sm:flex-row mr-auto mt-8 ml-auto w-full max-w-3xl">
            <div className="relative flex-grow w-full sm:w-auto">
              {/* Search icon */}
              <img
                src="/search.svg"
                alt="Search"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
              />

              {/* Input with left padding */}
              <input
                ref={inputRef}
                type="search"
                placeholder="Enter the playlist link"
                className="w-full p-2.5 pl-12 outline-purple-800 border border-purple-500 rounded-full lg:rounded-s-full md:rounded-e-none text-black"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={usedCredits >= 2 || loading}
              className={`w-[180px] sm:w-[140px] h-[50px] rounded-full sm:rounded-e-full sm:rounded-s-none text-white font-semibold text-base mt-4 sm:mt-0 mx-auto sm:mx-0 transition-all duration-200 ${
                usedCredits >= 2 || loading
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-[#5d57ee] to-[#353188] hover:from-[#353188] hover:to-[#5d57ee] cursor-pointer"
              }`}
            >
              {loading
                ? "Generating..."
                : usedCredits >= 2
                  ? "No Credits"
                  : "Generate"}
            </button>
          </div>
          <div className="text-sm md:text-xl mt-12 text-slate-700 font-normal font-['inter']">
            Automatically schedule your playlist, track your progress, and stay
            motivated with streaks!
          </div>
        </h2>
      </BackgroundBeamsWithCollision>

      {/* Content section that appears after form submission */}
      {(loading || playList) && (
        <div
          ref={sectionRef}
          className="w-screen bg-white py-20 flex flex-col items-center justify-center"
        >
          {loading && (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-[#5D57EE] rounded-full"></div>
              <p className="text-lg text-gray-700">
                Generating your schedule...
              </p>
            </div>
          )}

          {!loading && playList && <Render data={playList} />}
        </div>
      )}

<Footer/>
    </div>
  );
}
