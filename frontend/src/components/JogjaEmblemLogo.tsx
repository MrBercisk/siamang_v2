interface JogjaEmblemLogoProps {
  className?: string;
}

export function JogjaEmblemLogo({ className = "w-12 h-14" }: JogjaEmblemLogoProps) {
  return (
    <svg className={className} viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Yellow Shield */}
      <path
        d="M60 4 L112 28 V76 C112 108 60 134 60 134 C60 134 8 108 8 76 V28 Z"
        fill="#FFD700"
        stroke="#C59B12"
        strokeWidth="3"
      />
      {/* Inner Green Shield */}
      <path
        d="M60 12 L104 32 V74 C104 102 60 125 60 125 C60 125 16 102 16 74 V32 Z"
        fill="#0f766e"
        stroke="#FFD700"
        strokeWidth="2"
      />
      {/* Yellow Star at top */}
      <polygon
        points="60,18 63,26 72,26 65,32 67,40 60,35 53,40 55,32 48,26 57,26"
        fill="#FFD700"
      />
      {/* Tugu Jogja Monument representation */}
      <rect x="56" y="48" width="8" height="36" fill="#FFFFFF" rx="1" />
      <polygon points="60,40 52,48 68,48" fill="#FFD700" />
      <rect x="48" y="84" width="24" height="6" fill="#FFD700" rx="1" />
      {/* Garland framing */}
      <path d="M28 48 Q22 68 36 88" stroke="#FFD700" strokeWidth="3" fill="none" />
      <path d="M92 48 Q98 68 84 88" stroke="#FFFFFF" strokeWidth="3" fill="none" />
      {/* Ribbon Banner at bottom */}
      <path d="M22 94 L98 94 L92 106 L28 106 Z" fill="#FFD700" />
      <text x="60" y="102" textAnchor="middle" fill="#000000" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">
        KOTA JOGJAKARTA
      </text>
    </svg>
  );
}
