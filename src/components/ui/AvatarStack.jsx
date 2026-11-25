import { Plus } from 'lucide-react';

export default function AvatarStack({ reverse = false, className = '' }) {
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  ];

  return (
    <div
      className={`inline-flex items-center ${reverse ? 'flex-row-reverse' : ''} ${className}`}
    >
      <div className="flex -space-x-2">
        {avatars.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Loomy Community"
            className="h-8 w-8 rounded-full border-2 border-white object-cover shadow-xs"
          />
        ))}
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#F5A6D8] text-[#111111] shadow-xs">
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
        </span>
      </div>
    </div>
  );
}
