import { Plus } from 'lucide-react';

const ITEMS = [
  'ERGONOMIC FIT',
  'NEW DROPS',
  'BREATHABLE TECH',
  'PREMIUM MATERIALS',
  'LIMITED EDITION 2026',
  'NEW DROPS',
];

export default function MarqueeTicker() {
  return (
    <div className="relative overflow-hidden border-y border-dashed border-black/15 bg-white py-4 select-none">
      <div className="animate-loomy-marquee flex items-center gap-6">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 whitespace-nowrap">
            <span className="text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase sm:text-sm">
              {item}
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111111] text-white">
              <Plus className="h-3 w-3 stroke-[2.5]" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
