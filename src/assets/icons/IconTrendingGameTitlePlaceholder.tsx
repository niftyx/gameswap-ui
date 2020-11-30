import React from "react";

export const IconTrendingGameTitlePlaceholder = () => (
  <svg
    id="asset-placeholder"
    viewBox="0 0 80 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      clipPath="url(#bbjkowjr824)"
      height="24"
      style={{ fill: "url(#vbxjvo24)" }}
      width="80"
      x="0"
      y="0"
    ></rect>
    <defs>
      <clipPath id="bbjkowjr824">
        <rect height="24" rx="2" ry="2" width="80" x="0" y="0"></rect>
      </clipPath>
      <linearGradient id="vbxjvo24">
        <stop offset="0%" stopColor="#333739" stopOpacity="1">
          <animate
            attributeName="offset"
            dur="2s"
            keyTimes="0; 0.25; 1"
            repeatCount="indefinite"
            values="-2; -2; 1"
          ></animate>
        </stop>
        <stop offset="50%" stopColor="#3A3D3E" stopOpacity="1">
          <animate
            attributeName="offset"
            dur="2s"
            keyTimes="0; 0.25; 1"
            repeatCount="indefinite"
            values="-1; -1; 2"
          ></animate>
        </stop>
        <stop offset="100%" stopColor="#333739" stopOpacity="1">
          <animate
            attributeName="offset"
            dur="2s"
            keyTimes="0; 0.25; 1"
            repeatCount="indefinite"
            values="0; 0; 3"
          ></animate>
        </stop>
      </linearGradient>
    </defs>
  </svg>
);
