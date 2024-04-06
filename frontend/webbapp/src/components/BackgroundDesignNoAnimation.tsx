import React from "react";

interface BackGroundDesignNoAnimationProps {
  style?: React.CSSProperties;
  color1: string;
  color2: string;
  waveColor: string; // New prop for specifying the color of the waves
}

const BackGroundDesignNoAnimation: React.FC<
  BackGroundDesignNoAnimationProps
> = ({ style, color1, color2, waveColor }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="200%">
          <stop offset="0%" style={{ stopColor: color1, stopOpacity: 0.5 }} />
          <stop offset="100%" style={{ stopColor: color2, stopOpacity: 1 }} />
        </linearGradient>
        <filter id="waveFilter" x="0" y="0" width="200%" height="200%">
          <feOffset result="offOut" in="SourceGraphic" dx="-0" dy="20" />
          <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
        </filter>
      </defs>
      <rect width="100" height="100" fill="white" />
      <g filter="url(#waveFilter)">
        <path
          d={`M-10,100
                  C10, 60
                  30, 40
                  50, 60
                  70, 80
                  90, 60
                  110, 40
                  130, 60
                  150, 80
                  170, 60
                  190, 40
                  210, 60
                  230, 80
                  250, 60
                  270, 40
                  290, 60
                  310, 80
                  330, 60
                  350, 40
                  370, 60
                  390, 80
                  410, 60
                  430, 40
                  450, 60
                  470, 80
                  490, 60
                  510, 40
                  530, 60
                  550, 80
                  570, 60
                  590, 40
                  610, 60
                  630, 80
                  650, 60
                  670, 40
                  690, 60
                  710, 80
                  730, 60
                  750, 40
                  770, 60
                  790, 80
                  810, 60
                  830, 40
                  850, 60
                  870, 80
                  890, 60
                  910, 40
                  930, 60
                  950, 80
                  970, 60
                  990, 100
                  L 990, 100
                  L 990, 100
                  L -10, 100 Z`}
          fill="none" // Changed to "none" to make the waves transparent
          stroke={waveColor} // Added stroke to specify the color of the waves
          strokeWidth="4" // Adjust the thickness of the wave lines as needed
        />
      </g>
    </svg>
  );
};

export default BackGroundDesignNoAnimation;
