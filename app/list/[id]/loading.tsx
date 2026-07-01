import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b1b3a] p-8 space-y-8">
      <Skeleton className="h-8 w-40 bg-white/10" />
      <Skeleton className="h-10 w-72 bg-white/10" />
      <Skeleton className="h-32 rounded-xl bg-white/10" />
      <Skeleton className="h-64 rounded-xl bg-white/10" />
    </div>
  );
}
