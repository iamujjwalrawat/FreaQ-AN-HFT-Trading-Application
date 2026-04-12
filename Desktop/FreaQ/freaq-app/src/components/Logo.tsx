import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', width = 32, height = 32 }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Glow */}
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F2FF" />
          <stop offset="100%" stopColor="#0088FF" />
        </linearGradient>
      </defs>
      
      {/* F structure integrated with candlestick */}
      {/* Left thick bar - The main body of 'F' */}
      <rect x="16" y="12" width="8" height="40" rx="2" fill="url(#neonGradient)" filter="url(#glow)"/>
      
      {/* Top horizontal bar of 'F' extending into a candlestick body */}
      <rect x="24" y="12" width="24" height="8" rx="2" fill="url(#neonGradient)" />
      {/* Candlestick wick for top bar */}
      <rect x="34" y="4" width="4" height="8" rx="1" fill="#00F2FF" />
      <rect x="34" y="20" width="4" height="8" rx="1" fill="#00F2FF" />
      
      {/* Middle horizontal bar of 'F' extended to another candlestick */}
      <rect x="24" y="28" width="16" height="8" rx="2" fill="#FF0055" />
      {/* Candlestick wick for middle bar */}
      <rect x="30" y="24" width="4" height="4" rx="1" fill="#FF0055" />
      <rect x="30" y="36" width="4" height="12" rx="1" fill="#FF0055" />

    </svg>
  );
};

export default Logo;
