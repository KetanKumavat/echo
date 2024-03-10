import React from "react";
import { cn } from "../utils/cn";
import { Spotlight } from "./ui/Spotlight";

export default function SpotlightPreview() {
  return (
    <div className="h-screen w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-6xl md:text-8xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Echo
        </h1>
        <p className="mt-4 text-3xl font-semibold text-neutral-300 max-w-lg text-center mx-auto">
          Say goodbye to writer's block.
        </p>
      </div>
    </div>
  );
}
