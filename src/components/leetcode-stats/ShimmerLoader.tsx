import React from "react";

export default function ShimmerLoader() {
  return (
    <div className="flex justify-center my-8">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-2xl h-[220px] w-[180px] mb-4 animate-pulse" />
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-lg h-6 w-32 animate-pulse" />
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-lg h-4 w-24 mt-2 animate-pulse" />
        </div>
        <div className="md:col-span-7 flex justify-center">
          <div className="bg-gray-200 dark:bg-neutral-800 rounded-2xl h-[220px] w-[60vw] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
