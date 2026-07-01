import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b1b3a] p-8 space-y-8">
      <div className="flex items-end justify-between">
        <Skeleton className="h-10 w-64 bg-white/10" />
        <Skeleton className="h-10 w-40 bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl bg-white/10" />
        ))}
      </div>

      <Skeleton className="h-32 rounded-xl bg-white/10" />
      <Skeleton className="h-48 rounded-xl bg-white/10" />
    </div>
  );
}
