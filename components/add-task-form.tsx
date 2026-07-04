"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PrioritySelect from "@/components/priority-select";
import type { Priority } from "@/lib/priority";

export default function AddTaskForm({ listId }: { listId: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Le titre de la tâche est requis.");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskListId: listId,
        title: title.trim(),
        description: description.trim(),
        priority,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      toast.error("Impossible d'ajouter la tâche.");
      return;
    }

    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    router.refresh();
  };

  return (
    <div className="space-y-3 rounded-xl border border-[#e5d6f3] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-[#0b1b3a]">Nouvelle tâche</p>
        <PrioritySelect value={priority} onChange={setPriority} />
      </div>

      <Input
        placeholder="Titre de la tâche"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border-[#b57edc] focus:ring-[#b57edc]"
      />

      <Textarea
        placeholder="Description (optionnel)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border-[#b57edc] focus:ring-[#b57edc]"
      />

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-[#b57edc] hover:bg-[#9b5fc9] text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        {submitting ? "Ajout..." : "Ajouter la tâche"}
      </Button>
    </div>
  );
}
