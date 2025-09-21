"use client";

import React, { useState, useRef, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { YplaylistType } from "@/schemas/Yplaylist";
import Render from "./Render/render";
import { useSession } from "next-auth/react";

import MainNavbar from "@/app/components/MainNavBar";
import Footer from "@/app/components/Footer";

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

    if(usedCredits >= 2){
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
  const isButtonDisabled = usedCredits >= 2 || loading || !inputRef.current?.value?.trim();
  const remainingCredits = Math.max(0, 2 - usedCredits);

  return (
    <div className="w-screen">
      {/* Main content with gradient covering full viewport */}
      <div className="min-h-screen w-screen bg-gradient-to-r from-[#5d57ee]/90 to-purple-400">
        <div className="flex justify-center w-screen ml-2">
          <MainNavbar />

          <div className="flex flex-col items-center justify-center gap-6 px-4 pt-72">
            <div className="text-white text-center">
              <h1 className="text-5xl font-bold drop-shadow-md font-['Inter']">
                Welcome {userName}, schedule your YouTube playlist
              </h1>
              <p className="mt-4 text-base font-normal">
                Automatically schedule your playlist, track your progress, and stay
                motivated!
              </p>
            </div>

            {/* Credits Display */}
            <div className="text-white text-center">
              <p className="text-sm">
                {usedCredits >= 2 ? (
                  <span className="text-red-400 text-base font-semibold">
                    No credits remaining. Upgrade to premium for unlimited access!
                  </span>
                ) : (
                  <span>
                    </span>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center w-full max-w-3xl mt-6">
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
                  className="w-full p-3 pl-12 rounded-s-full text-black"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={usedCredits >= 2 || loading}
                className={`w-full sm:w-[140px] h-[51px] rounded-e-full text-white font-semibold text-base mt-4 sm:mt-0 transition-all duration-200 ${
                  usedCredits >= 2 || loading
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-[#5d57ee] to-[#353188] hover:from-[#4a44d9] hover:to-[#2a2570] cursor-pointer'
                }`}
              >
                {loading ? 'Generating...' : usedCredits >= 2 ? 'No Credits' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      </div>

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


      <Footer />
    </div>
  );
}