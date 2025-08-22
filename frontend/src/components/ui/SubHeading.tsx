import React from "react";

interface SubHeadingProps {
  tagline: string;
  description: string;
  title: string;
}

export default function SubHeading({
  tagline,
  description,
  title,
}: SubHeadingProps) {
  return (
    <div className="w-full flex gap-3 justify-center items-center py-5">
      <svg
        width="40"
        height="40"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 25 L8 25 L12 15 L18 35 L22 10 L28 40 L32 20 L38 30 L42 25 L48 25"
          stroke="#3e8cff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="flex flex-col items-center gap-5">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30">
          <span className="text-accent font-semibold">{tagline}</span>
        </div>
        <h2 className="text-2xl text-center md:text-4xl font-bold text-primary dark:text-white">
          {title}
        </h2>
        <p className="text-base text-gray-400 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed text-center ">
          {description}
        </p>
      </div>

      <svg
        width="40"
        height="40"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 25 L8 25 L12 15 L18 35 L22 10 L28 40 L32 20 L38 30 L42 25 L48 25"
          stroke="#3e8cff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
