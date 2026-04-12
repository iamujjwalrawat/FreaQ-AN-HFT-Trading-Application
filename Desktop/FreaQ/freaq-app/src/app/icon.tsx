import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B0E14',
          borderRadius: '8px',
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* F structure integrated with candlestick */}
          {/* Left thick bar */}
          <rect x="16" y="12" width="8" height="40" rx="2" fill="#00F2FF"/>
          
          {/* Top horizontal bar */}
          <rect x="24" y="12" width="24" height="8" rx="2" fill="#00F2FF" />
          <rect x="34" y="4" width="4" height="8" rx="1" fill="#00F2FF" />
          <rect x="34" y="20" width="4" height="8" rx="1" fill="#00F2FF" />
          
          {/* Middle horizontal bar */}
          <rect x="24" y="28" width="16" height="8" rx="2" fill="#FF0055" />
          <rect x="30" y="24" width="4" height="4" rx="1" fill="#FF0055" />
          <rect x="30" y="36" width="4" height="12" rx="1" fill="#FF0055" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
