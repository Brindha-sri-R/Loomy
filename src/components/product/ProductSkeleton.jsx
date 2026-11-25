export default function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-[22px] border border-black/[0.04] bg-white p-3">
      <div className="loomy-shimmer aspect-[4/4.5] w-full rounded-[16px]" />
      <div className="mt-3.5 flex items-end justify-between px-1 pb-1">
        <div className="space-y-2">
          <div className="loomy-shimmer h-4 w-32 rounded-full" />
          <div className="loomy-shimmer h-4 w-20 rounded-full" />
        </div>
        <div className="loomy-shimmer h-9 w-9 rounded-full" />
      </div>
    </div>
  );
}

export function DrawerRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-[#F6F6F8] p-3">
      <div className="loomy-shimmer h-20 w-18 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2.5">
        <div className="loomy-shimmer h-4 w-3/4 rounded-full" />
        <div className="loomy-shimmer h-3 w-1/3 rounded-full" />
        <div className="loomy-shimmer h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}
