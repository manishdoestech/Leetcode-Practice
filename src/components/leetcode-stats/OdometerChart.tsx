import React, { useState, useEffect } from "react";
import { ProblemData } from "./types";

interface OdometerChartProps {
  readonly data: ProblemData[];
  readonly acceptanceRate?: number;
}

export default function OdometerChart({ data, acceptanceRate }: Readonly<OdometerChartProps>) {
  const [isHovered, setIsHovered] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  // SVG/clipPath mask for LeetCode-style odometer
  // Arc math
  const totalQuestions = data.reduce((sum, d) => sum + d.total, 0);
  const totalSolved = data.reduce((sum, d) => sum + d.solved, 0);
  const radius = 42;
  const center = 50;
  const strokeWidth = 3;
  const circleLength = 2 * Math.PI * radius;
  // Angles for each section
  const easy = data[0];
  const medium = data[1];
  const hard = data[2];
  const easyLen = (easy.total / totalQuestions) * circleLength;
  const mediumLen = (medium.total / totalQuestions) * circleLength;
  const hardLen = (hard.total / totalQuestions) * circleLength;
  // Calculate dynamic lengths based on animation progress and hover state
  const getAnimatedLength = (targetLength: number) => {
    return targetLength * animationProgress;
  };

  // Calculate solved lengths with animation
  const easySolvedLen = getAnimatedLength((easy.solved / easy.total) * easyLen);
  const mediumSolvedLen = getAnimatedLength((medium.solved / medium.total) * mediumLen);
  const hardSolvedLen = getAnimatedLength((hard.solved / hard.total) * hardLen);

  // For acceptance rate, calculate the filled portion
  const acceptanceProgress = acceptanceRate ? acceptanceRate / 100 : 0;
  const acceptanceLen = circleLength * acceptanceProgress * animationProgress;
  // Mask path for donut
  const maskPath =
    "M21.36 21.36C5.55 37.18 5.55 62.82 21.36 78.64C21.95 79.22 21.95 80.17 21.36 80.76C20.78 81.34 19.83 81.34 19.24 80.76C2.25 63.77 2.25 36.23 19.24 19.24C36.23 2.25 63.77 2.25 80.76 19.24C97.75 36.23 97.75 63.77 80.76 80.76C80.17 81.34 79.22 81.34 78.64 80.76C78.05 80.17 78.05 79.22 78.64 78.64C94.45 62.82 94.45 37.18 78.64 21.36C62.82 5.55 37.18 5.55 21.36 21.36Z";

  return (
    <button
      className="relative flex items-center justify-center bg-transparent border-none p-0 outline-none focus:outline-none"
      style={{ width: 160, height: 160 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={isHovered && acceptanceRate !== undefined 
        ? `Acceptance rate: ${acceptanceRate}%` 
        : `Problems solved: ${totalSolved} out of ${totalQuestions}`}
    >
      <svg
        viewBox="0 0 100 100"
        width={160}
        height={160}
        className="absolute left-0 top-0"
      >
        <defs>
          <clipPath id="bar-mask">
            <path d={maskPath} />
          </clipPath>
        </defs>
        {/* Acceptance rate visualization - single green circle (outside mask for full circle) */}
        <g style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}>
          {/* Acceptance rate filled */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#22c55e"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${isHovered && acceptanceRate !== undefined ? acceptanceLen : 0},${circleLength}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            style={{
              opacity: isHovered && acceptanceRate !== undefined ? 1 : 0,
              transition: 'opacity 0.2s ease-out, stroke-dasharray 0.3s ease-out'
            }}
          />
        </g>

        <g clipPath="url(#bar-mask)">
          {/* Normal problem difficulty visualization */}
          {/* Easy unsolved */}
          <g
            style={{ transform: "rotate(225deg)", transformOrigin: "50% 50%" }}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#bbf7d0"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${easyLen},${circleLength - easyLen}`}
              strokeDashoffset={66}
              strokeLinecap="round"
              style={{
                opacity: isHovered && acceptanceRate !== undefined ? 0 : 1,
                transition: 'opacity 0.2s ease-out'
              }}
            />
            {/* Easy solved */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#059669"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${easySolvedLen},${circleLength - easySolvedLen}`}
              strokeDashoffset={66}
              strokeLinecap="round"
              style={{
                opacity: isHovered && acceptanceRate !== undefined ? 0 : 1,
                transition: 'opacity 0.2s ease-out, stroke-dasharray 0.3s ease-out'
              }}
            />
          </g>
          {/* Medium unsolved */}
          <g
            style={{
              transform: `rotate(${295.42}deg)`,
              transformOrigin: "50% 50%",
            }}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#fef9c3"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${mediumLen},${circleLength - mediumLen}`}
              strokeDashoffset={66}
              strokeLinecap="round"
              style={{
                opacity: isHovered && acceptanceRate !== undefined ? 0 : 1,
                transition: 'opacity 0.2s ease-out'
              }}
            />
            {/* Medium solved */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#eab308"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${mediumSolvedLen},${circleLength - mediumSolvedLen}`}
              strokeDashoffset={66}
              strokeLinecap="round"
              style={{
                opacity: isHovered && acceptanceRate !== undefined ? 0 : 1,
                transition: 'opacity 0.2s ease-out, stroke-dasharray 0.3s ease-out'
              }}
            />
          </g>
          {/* Hard unsolved */}
          <g
            style={{
              transform: `rotate(${435.36}deg)`,
              transformOrigin: "50% 50%",
            }}
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#fecaca"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${hardLen},${circleLength - hardLen}`}
              strokeDashoffset={66}
              strokeLinecap="round"
              style={{
                opacity: isHovered && acceptanceRate !== undefined ? 0 : 1,
                transition: 'opacity 0.2s ease-out'
              }}
            />
            {/* Hard solved */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#b91c1c"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${hardSolvedLen},${circleLength - hardSolvedLen}`}
              strokeDashoffset={66}
              strokeLinecap="round"
              style={{
                opacity: isHovered && acceptanceRate !== undefined ? 0 : 1,
                transition: 'opacity 0.2s ease-out, stroke-dasharray 0.3s ease-out'
              }}
            />
          </g>
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[30px] font-semibold leading-[32px] transition-all duration-300 ease-in-out">
          {isHovered && acceptanceRate !== undefined ? (
            <>
              {acceptanceRate}
              <span className="text-base font-normal">%</span>
            </>
          ) : (
            <>
              {totalSolved}
              <span className="text-base font-normal">/{totalQuestions}</span>
            </>
          )}
        </div>
        <div className="text-xs leading-normal p-1 mt-1 transition-all duration-300 ease-in-out">
          {isHovered && acceptanceRate !== undefined ? 'Acceptance' : 'Solved'}
        </div>
      </div>
    </button>
  );
}
