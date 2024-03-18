import React from "react";
import { cn } from "../utils/cn";
import { Spotlight } from "./ui/Spotlight";
import { IconBrandGoogle } from "@tabler/icons-react";

export default function SpotlightPreview() {
  return (
    <div
      className="h-screen w-full flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden items-center justify-center"
      id="spotty">
      <Spotlight
        className="-top-40 md:flex justify-center items-center hidden left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="flex flex-col justify-center md:m-[25vh] max-w-7xl  mx-auto relative z-10  w-full scroll-pt-24 md:pt-0">
        <h1 className="text-9xl md:text-9xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 -mt-40">
          Echo
        </h1>
        <p className="mt-4 text-3xl font-semibold text-neutral-300 max-w-lg text-center mx-auto">
          Say goodbye to writer's block.
        </p>
      </div>
    </div>
  );
}