import React from "react";

export const IconGameAssetPlaceholder = () => (
  <svg
    id="asset-placeholder"
    viewBox="0 0 135 206"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      clipPath="url(#zlj50hz2roe)"
      height="206"
      style={{ fill: "url(#bmr4zvnzb9e)" }}
      width="135"
      x="0"
      y="0"
    ></rect>
    <defs>
      <clipPath id="zlj50hz2roe">
        <rect height="135" rx="2" ry="2" width="135" x="0" y="0"></rect>
        <rect height="20" rx="2" ry="2" width="135" x="0" y="140"></rect>
        <rect height="16" rx="2" ry="2" width="60" x="0" y="162"></rect>
        <rect height="16" rx="2" ry="2" width="47" x="95" y="162"></rect>
        <rect height="16" rx="2" ry="2" width="47" x="0" y="180"></rect>
      </clipPath>
      <linearGradient id="bmr4zvnzb9e">
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
