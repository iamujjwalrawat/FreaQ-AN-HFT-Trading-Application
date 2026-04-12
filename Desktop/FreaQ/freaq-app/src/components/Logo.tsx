import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', width = 32, height = 32 }) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}
      style={{ width, height, borderRadius: Math.max(8, width * 0.2) }}
    >
      <Image
        src="/logo.png"
        alt="Freaq Logo"
        fill
        sizes={`${width}px`}
        className="object-cover"
        priority
      />
    </div>
  );
};

export default Logo;
