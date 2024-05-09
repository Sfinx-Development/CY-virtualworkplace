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
          d={`M-10,60
                  C0, 50, 20, 50, 40, 60
                  C60, 70, 80, 80, 100, 70
                  C120, 60, 140, 50, 160, 60
                  C180, 70, 200, 80, 220, 70
                  C240, 60, 260, 50, 280, 60
                  C300, 70, 320, 80, 340, 70
                  C360, 60, 380, 50, 400, 60
                  C420, 70, 440, 80, 460, 70
                  C480, 60, 500, 50, 520, 60
                  C540, 70, 560, 80, 580, 70
                  C600, 60, 620, 50, 640, 60
                  C660, 70, 680, 80, 700, 70
                  C720, 60, 740, 50, 760, 60
                  C780, 70, 800, 80, 820, 70
                  C840, 60, 860, 50, 880, 60
                  C900, 70, 920, 80, 940, 70
                  C960, 60, 980, 50, 1000, 60
                  L1000, 100
                  L-10, 100 Z`}
          fill="none" // Changed to "none" to make the waves transparent
          stroke={waveColor} // Added stroke to specify the color of the waves
          strokeWidth="2" // Adjust the thickness of the wave lines as needed
        />
      </g>
      <g filter="url(#waveFilter)">
        <path
          d={`M-10,50
                  C0, 40, 20, 40, 40, 50
                  C60, 60, 80, 70, 100, 60
                  C120, 50, 140, 40, 160, 50
                  C180, 60, 200, 70, 220, 60
                  C240, 50, 260, 40, 280, 50
                  C300, 60, 320, 70, 340, 60
                  C360, 50, 380, 40, 400, 50
                  C420, 60, 440, 70, 460, 60
                  C480, 50, 500, 40, 520, 50
                  C540, 60, 560, 70, 580, 60
                  C600, 50, 620, 40, 640, 50
                  C660, 60, 680, 70, 700, 60
                  C720, 50, 740, 40, 760, 50
                  C780, 60, 800, 70, 820, 60
                  C840, 50, 860, 40, 880, 50
                  C900, 60, 920, 70, 940, 60
                  C960, 50, 980, 40, 1000, 50
                  L1000, 100
                  L-10, 100 Z`}
          fill="none" // Changed to "none" to make the waves transparent
          stroke={waveColor} // Added stroke to specify the color of the waves
          strokeWidth="2" // Adjust the thickness of the wave lines as needed
        />
      </g>
      <g filter="url(#waveFilter)">
        <path
          d={`M-10,40
                  C0, 30, 20, 30, 40, 40
                  C60, 50, 80, 60, 100, 50
                  C120, 40, 140, 30, 160, 40
                  C180, 50, 200, 60, 220, 50
                  C240, 40, 260, 30, 280, 40
                  C300, 50, 320, 60, 340, 50
                  C360, 40, 380, 30, 400, 40
                  C420, 50, 440, 60, 460, 50
                  C480, 40, 500, 30, 520, 40
                  C540, 50, 560, 60, 580, 50
                  C600, 40, 620, 30, 640, 40
                  C660, 50, 680, 60, 700, 50
                  C720, 40, 740, 30, 760, 40
                  C780, 50, 800, 60, 820, 50
                  C840, 40, 860, 30, 880, 40
                  C900, 50, 920, 60, 940, 50
                  C960, 40, 980, 30, 1000, 40
                  L1000, 100
                  L-10, 100 Z`}
          fill="none" // Changed to "none" to make the waves transparent
          stroke={waveColor} // Added stroke to specify the color of the waves
          strokeWidth="2" // Adjust the thickness of the wave lines as needed
        />
      </g>
      <g filter="url(#waveFilter)">
        <path
          d={`M-10,30
                  C0, 20, 20, 20, 40, 30
                  C60, 40, 80, 50, 100, 40
                  C120, 30, 140, 20, 160, 30
                  C180, 40, 200, 50, 220, 40
                  C240, 30, 260, 20, 280, 30
                  C300, 40, 320, 50, 340, 40
                  C360, 30, 380, 20, 400, 30
                  C420, 40, 440, 50, 460, 40
                  C480, 30, 500, 20, 520, 30
                  C540, 40, 560, 50, 580, 40
                  C600, 30, 620, 20, 640, 30
                  C660, 40, 680, 50, 700, 40
                  C720, 30, 740, 20, 760, 30
                  C780, 40, 800, 50, 820, 40
                  C840, 30, 860, 20, 880, 30
                  C900, 40, 920, 50, 940, 40
                  C960, 30, 980, 20, 1000, 30
                  L1000, 100
                  L-10, 100 Z`}
          fill="none" // Changed to "none" to make the waves transparent
          stroke={waveColor} // Added stroke to specify the color of the waves
          strokeWidth="2" // Adjust the thickness of the wave lines as needed
        />
      </g>
    </svg>
  );
};

export default BackGroundDesignNoAnimation;
