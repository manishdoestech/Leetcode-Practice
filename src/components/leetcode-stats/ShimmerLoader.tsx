import React from "react";

export default function ShimmerLoader() {
  return (
    <div className="flex justify-center my-8 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4">
        {/* Left panel placeholder */}
        <div className="w-full md:w-1/5 flex flex-col items-center">
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-3xl h-[220px] w-full mb-4 animate-pulse" />
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-lg h-6 w-32 animate-pulse" />
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-lg h-4 w-24 mt-2 animate-pulse" />
        </div>
        {/* Right panel placeholder */}
        <div className="w-full md:w-4/5 flex justify-center">
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-3xl h-[220px] w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
