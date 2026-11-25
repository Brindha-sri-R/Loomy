import { useState } from 'react';

export default function Loomy3DSculpture({
  scrollY = 0,
  label = 'ATELIER',
  className = '',
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -24;
    setTilt({ x: y, y: x });
  };

  const scrollRotY = (scrollY * 0.14) % 360;
  const scrollRotX = Math.sin(scrollY * 0.004) * 10;

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className={`perspective-1000 relative flex h-32 w-32 items-center justify-center select-none sm:h-40 sm:w-40 ${className}`}
      aria-hidden="true"
    >
      {/* Scroll-driven + mouse-interactive outer 3D container */}
      <div
        className="preserve-3d relative flex h-full w-full items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x + scrollRotX}deg) rotateY(${tilt.y + scrollRotY}deg)`,
        }}
      >
        {/* Orbiting precision ring */}
        <div className="animate-orbit-ring preserve-3d pointer-events-none absolute inset-2 rounded-full border border-[#111111]/20 shadow-[0_0_24px_rgba(124,139,255,0.22)]">
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#7C8BFF]" />
        </div>

        {/* Secondary tilted ring */}
        <div
          className="preserve-3d pointer-events-none absolute inset-5 rounded-full border border-dashed border-[#7C8BFF]/45"
          style={{ transform: 'rotateX(-58deg) rotateY(24deg)' }}
        />

        {/* Core 3D rotating sculptural L-emblem prism */}
        <div className="animate-spin-3d preserve-3d relative flex h-20 w-20 items-center justify-center sm:h-22 sm:w-22">
          {/* Front glass plane with abstract L symbol */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/75 bg-white/70 shadow-[0_12px_32px_rgba(17,17,17,0.12)] backdrop-blur-md"
            style={{ transform: 'translateZ(16px)' }}
          >
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <polygon points="7,4 14,4 14,25 7,31" fill="#111111" />
              <polygon points="10,33 17,27 33,27 29,33" fill="#111111" />
              <polygon
                points="18,10 23,10 23,23 32,23 29,25 18,25"
                fill="rgba(17,17,17,0.28)"
              />
              <polygon points="27,7 33,7 27,13 21,13" fill="#7C8BFF" />
            </svg>
          </div>

          {/* Mid obsidian plane */}
          <div
            className="absolute inset-1 rounded-2xl border border-[#7C8BFF]/35 bg-[#111111]/90"
            style={{ transform: 'translateZ(0px)' }}
          />

          {/* Back lavender chrome plane */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/50 bg-[#DCE0FC]/85 backdrop-blur-xs"
            style={{ transform: 'translateZ(-16px) rotateY(180deg)' }}
          >
            <span className="text-[9px] font-bold tracking-[0.26em] text-[#111111] uppercase">
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
