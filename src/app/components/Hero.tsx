"use client";

import React, { useRef } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { useRouter } from "next/navigation";

export function BackgroundBeamsWithCollisionDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = () => {
    const url = inputRef.current?.value?.trim();

    if (!url) {
      console.warn("Please enter a playlist URL");
      return;
    }

    router.replace("/sign-up");
  };

  return (
    <BackgroundBeamsWithCollision>
      <h2 className="text-2xl relative z-20 md:text-4xl lg:text-5xl font-black text-center text-black/70 dark:text-white font-sans tracking-tight">
        Use AI to schedule your YouTube playlist automatically <br />
        <div className="text-sm md:text-xl mt-4 text-slate-500 font-medium font-['inter']">
          Take control of your learning and entertainment journey with
        </div>

        {/* App name gradient */}
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span>StreamCalendar</span>
          </div>
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span>StreamCalendar</span>
          </div>
        </div>

        {/* Input + Button */}
        <div className="flex text-base font-normal flex-col sm:flex-row mx-auto mt-8 w-full max-w-3xl">
          <div className="relative flex-grow w-full sm:w-auto">
            <img
              src="/search.svg"
              alt="Search"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
            />

            <input
              ref={inputRef}
              type="search"
              placeholder="Enter the playlist link"
              className="w-full p-2.5 pl-12 outline-purple-800 border border-purple-500 rounded-full lg:rounded-s-full md:rounded-e-none text-black"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#5d57ee] to-[#353188] w-[180px] sm:w-[140px] h-[50px] rounded-full sm:rounded-e-full sm:rounded-s-none text-white font-semibold text-base mt-4 sm:mt-0 mx-auto sm:mx-0 hover:from-[#353188] hover:to-[#5d57ee]"
          >
            Generate
          </button>
        </div>

        <div className="text-sm md:text-xl mt-12 text-slate-700 font-normal font-['inter']">
          Automatically schedule your playlist, track your progress, and stay
          motivated with streaks!
        </div>
      </h2>
    </BackgroundBeamsWithCollision>
  );
}