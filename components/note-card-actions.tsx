"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pin, PinOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoteCardActions({
  listId,
  pinned,
}: {
  listId: number;
  pinned: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const togglePin = async () => {
    setLoading(true);
    const res = await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notePinned: !pinned }),
    });
    setLoading(false);

    if (!res.ok) {
      toast.error("Impossible d'épingler la note.");
      return;
    }

    router.refresh();
  };

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: null }),
    });
    setLoading(false);

    if (!res.ok) {
      toast.error("Impossible de supprimer la note.");
      return;
    }

    toast.success("Note supprimée.");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        disabled={loading}
        onClick={togglePin}
        className={pinned ? "text-[#b57edc]" : "text-gray-400"}
        title={pinned ? "Désépingler" : "Épingler"}
      >
        {pinned ? (
          <Pin className="h-4 w-4 fill-current" />
        ) : (
          <PinOff className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        disabled={loading}
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-500"
        title="Supprimer la note"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
