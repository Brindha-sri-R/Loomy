export default function LoomyLogo({
  variant = 'dark',
  size = 'md',
  showMark = true,
  showWordmark = true,
  animate = false,
  className = '',
}) {
  const isLight = variant === 'light';
  const primary = isLight ? '#FFFFFF' : '#111111';
  const accent = '#7C8BFF';

  const sizeMap = {
    sm: { mark: 22, text: 'text-[14px] tracking-[0.28em]' },
    md: { mark: 26, text: 'text-[17px] tracking-[0.32em]' },
    lg: { mark: 34, text: 'text-[22px] tracking-[0.36em]' },
  };

  const { mark, text } = sizeMap[size] || sizeMap.md;

  return (
    <span
      className={`inline-flex items-center gap-3 select-none ${className}`}
      aria-label="LOOMY"
    >
      {showMark && (
        <svg
          width={mark}
          height={mark}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={animate ? 'animate-logo-reveal' : ''}
        >
          {/* Complete architectural frame + sculpted L monogram */}
          <rect
            x="2.5"
            y="2.5"
            width="35"
            height="35"
            rx="9"
            stroke={primary}
            strokeWidth="2.4"
          />
          <path
            d="M13 10.5V28.5H27.5"
            stroke={primary}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.5 10.5V21.5H27.5"
            stroke={accent}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {showWordmark && (
        <span
          className={`${text} leading-none font-bold uppercase`}
          style={{ color: primary }}
        >
          LOOMY
        </span>
      )}
    </span>
  );
}
