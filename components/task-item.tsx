"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import PrioritySelect from "@/components/priority-select";
import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/priority";

export default function TaskItem({
  id,
  title,
  description,
  initialDone,
  initialPriority,
  className,
}: {
  id: number;
  title: string;
  description?: string | null;
  initialDone: boolean;
  initialPriority: Priority;
  className?: string;
}) {
  const router = useRouter();
  const [isDone, setIsDone] = useState(initialDone);
  const [priority, setPriority] = useState(initialPriority);
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

  const changePriority = async (next: Priority) => {
    const previous = priority;
    setPriority(next);

    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: next }),
    });

    if (!res.ok) {
      setPriority(previous);
      toast.error("Impossible de mettre à jour la priorité.");
      return;
    }

    router.refresh();
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md p-2 hover:bg-[#f5effc]",
        className
      )}
    >
      <label className="flex flex-1 items-start gap-3 cursor-pointer">
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

      <PrioritySelect value={priority} onChange={changePriority} />
    </div>
  );
}
