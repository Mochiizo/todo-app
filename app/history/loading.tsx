import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b1b3a] p-8 space-y-8">
      <Skeleton className="h-10 w-56 bg-white/10" />

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl bg-white/10" />
        ))}
      </div>
    </div>
  );
}
