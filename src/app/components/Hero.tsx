"use client";

import React, { useState, useRef } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

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
    className="bg-gradient-to-r from-[#5d57ee] to-[#353188] w-full sm:w-[140px] h-[51px] rounded-e-full text-white font-semibold text-base mt-4 sm:mt-0"
  >
    Generate
  </button>
</div>

    </div>
  );
};

export default Hero;




export function BackgroundBeamsWithCollisionDemo() {
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
    <BackgroundBeamsWithCollision>
      <h2
        className="text-2xl relative z-20 md:text-4xl lg:text-5xl font-bold text-center text-black/70 dark:text-white font-sans tracking-tight">
         Use AI to schedule your YouTube playlist automatically{" "} <br/>
         <div className="md:text-xl lg:text-2xl mt-4 text-slate-700 font-light font-['inter'] "> Take control of your learning and entertainment journey with</div>
        
        <div
          className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div
            className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span className="">StreamCalendar</span>
          </div>
          <div
            className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span className="">StreamCalendar</span>
          </div>

          
        </div>

        
        <div className="flex text-base font-normal flex-col sm:flex-row mr-auto mt-8 ml-auto w-full max-w-3xl">
  <div className="relative  flex-grow w-full sm:w-auto">
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
      className="w-full p-2.5  pl-12 border  border-purple-500 rounded-full lg:rounded-s-full md:rounded-e-none text-black"

    />
  </div>

  <button
    onClick={handleSubmit}
    className="bg-gradient-to-r from-[#5d57ee] to-[#353188] w-[180px] sm:w-[140px] h-[50px] rounded-full sm:rounded-e-full sm:rounded-s-none text-white font-semibold text-base mt-4 sm:mt-0 mx-auto sm:mx-0 hover:from-[#353188] hover:to-[#5d57ee]"    >
    Generate
  </button>
</div>

<div className="md:text-base lg:text-lg mt-12 text-slate-700 font-normal font-['inter'] "> Automatically
          schedule your playlist, track your progress, and stay motivated with
          streaks!</div>
        
      </h2>

    </BackgroundBeamsWithCollision>
  );
}
