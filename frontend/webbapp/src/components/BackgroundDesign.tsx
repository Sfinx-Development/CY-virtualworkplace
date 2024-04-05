import React, { useEffect, useState } from "react";

interface BackGroundDesignProps {
  style?: React.CSSProperties;
  color1: string;
  color2: string;
}

const BackGroundDesign: React.FC<BackGroundDesignProps> = ({
  style,
  color1,
  color2,
}) => {
  const [animationTime, setAnimationTime] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prevTime) => prevTime + 1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
          <stop offset="0%" style={{ stopColor: color1, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: color2, stopOpacity: 1 }} />
        </linearGradient>
        <filter id="waveFilter" x="0" y="0" width="200%" height="200%">
          <feOffset result="offOut" in="SourceGraphic" dx="-20" dy="20" />
          <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
        </filter>
      </defs>
      <rect width="100" height="100" fill="white" />
      <g filter="url(#waveFilter)">
        <path
          d={`M-10,100
              C10, ${Math.sin(animationTime / 10) * 10 + 50}
              30, ${Math.sin(animationTime / 10 + 0.5) * 10 + 50}
              50, ${Math.sin(animationTime / 10 + 1) * 10 + 50}
              70, ${Math.sin(animationTime / 10 + 1.5) * 10 + 50}
              90, ${Math.sin(animationTime / 10 + 2) * 10 + 50}
              110, ${Math.sin(animationTime / 10 + 2.5) * 10 + 50}
              130, ${Math.sin(animationTime / 10 + 3) * 10 + 50}
              150, ${Math.sin(animationTime / 10 + 3.5) * 10 + 50}
              170, ${Math.sin(animationTime / 10 + 4) * 10 + 50}
              190, ${Math.sin(animationTime / 10 + 4.5) * 10 + 50}
              210, ${Math.sin(animationTime / 10 + 5) * 10 + 50}
              230, ${Math.sin(animationTime / 10 + 5.5) * 10 + 50}
              250, ${Math.sin(animationTime / 10 + 6) * 10 + 50}
              270, ${Math.sin(animationTime / 10 + 6.5) * 10 + 50}
              290, ${Math.sin(animationTime / 10 + 7) * 10 + 50}
              310, ${Math.sin(animationTime / 10 + 7.5) * 10 + 50}
              330, ${Math.sin(animationTime / 10 + 8) * 10 + 50}
              350, ${Math.sin(animationTime / 10 + 8.5) * 10 + 50}
              370, ${Math.sin(animationTime / 10 + 9) * 10 + 50}
              390, ${Math.sin(animationTime / 10 + 9.5) * 10 + 50}
              410, ${Math.sin(animationTime / 10 + 10) * 10 + 50}
              430, ${Math.sin(animationTime / 10 + 10.5) * 10 + 50}
              450, ${Math.sin(animationTime / 10 + 11) * 10 + 50}
              470, ${Math.sin(animationTime / 10 + 11.5) * 10 + 50}
              490, ${Math.sin(animationTime / 10 + 12) * 10 + 50}
              510, ${Math.sin(animationTime / 10 + 12.5) * 10 + 50}
              530, ${Math.sin(animationTime / 10 + 13) * 10 + 50}
              550, ${Math.sin(animationTime / 10 + 13.5) * 10 + 50}
              570, ${Math.sin(animationTime / 10 + 14) * 10 + 50}
              590, ${Math.sin(animationTime / 10 + 14.5) * 10 + 50}
              610, ${Math.sin(animationTime / 10 + 15) * 10 + 50}
              630, ${Math.sin(animationTime / 10 + 15.5) * 10 + 50}
              650, ${Math.sin(animationTime / 10 + 16) * 10 + 50}
              670, ${Math.sin(animationTime / 10 + 16.5) * 10 + 50}
              690, ${Math.sin(animationTime / 10 + 17) * 10 + 50}
              710, ${Math.sin(animationTime / 10 + 17.5) * 10 + 50}
              730, ${Math.sin(animationTime / 10 + 18) * 10 + 50}
              750, ${Math.sin(animationTime / 10 + 18.5) * 10 + 50}
              770, ${Math.sin(animationTime / 10 + 19) * 10 + 50}
              790, ${Math.sin(animationTime / 10 + 19.5) * 10 + 50}
              810, ${Math.sin(animationTime / 10 + 20) * 10 + 50}
              830, ${Math.sin(animationTime / 10 + 20.5) * 10 + 50}
              850, ${Math.sin(animationTime / 10 + 21) * 10 + 50}
              870, ${Math.sin(animationTime / 10 + 21.5) * 10 + 50}
              890, ${Math.sin(animationTime / 10 + 22) * 10 + 50}
              910, ${Math.sin(animationTime / 10 + 22.5) * 10 + 50}
              930, ${Math.sin(animationTime / 10 + 23) * 10 + 50}
              950, ${Math.sin(animationTime / 10 + 23.5) * 10 + 50}
              970, ${Math.sin(animationTime / 10 + 24) * 10 + 50}
              990,100
              L 100, 100 Z`}
          fill="url(#grad)"
        />
      </g>
    </svg>
  );
};

export default BackGroundDesign;
