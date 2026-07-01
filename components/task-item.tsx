"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function TaskItem({
  id,
  title,
  description,
  initialDone,
  className,
}: {
  id: number;
  title: string;
  description?: string | null;
  initialDone: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [isDone, setIsDone] = useState(initialDone);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    const next = !isDone;
    setIsDone(next);
    setLoading(true);

    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDone: next }),
    });

    setLoading(false);

    if (!res.ok) {
      setIsDone(!next);
      toast.error("Impossible de mettre à jour la tâche.");
      return;
    }

    router.refresh();
  };

  return (
    <label
      className={cn(
        "flex items-start gap-3 p-2 rounded-md hover:bg-[#f5effc] cursor-pointer",
        className
      )}
    >
      <Checkbox
        checked={isDone}
        onCheckedChange={toggle}
        disabled={loading}
        className="mt-0.5 data-[state=checked]:bg-[#b57edc]"
      />

      <div className="flex-1">
        <div className={isDone ? "line-through text-gray-400" : ""}>
          {title}
        </div>

        {description && (
          <div className="text-sm text-gray-500">{description}</div>
        )}
      </div>
    </label>
  );
}
