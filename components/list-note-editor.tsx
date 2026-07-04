"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pin, PinOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function formatUpdatedAt(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ListNoteEditor({
  listId,
  initialNote,
  initialPinned,
  initialUpdatedAt,
}: {
  listId: number;
  initialNote: string | null;
  initialPinned: boolean;
  initialUpdatedAt: string | null;
}) {
  const router = useRouter();
  const [note, setNote] = useState(initialNote ?? "");
  const [pinned, setPinned] = useState(initialPinned);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [saving, setSaving] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const save = async (value: string) => {
    setSaving(true);

    const res = await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: value }),
    });

    setSaving(false);

    if (!res.ok) {
      toast.error("Impossible d'enregistrer la note.");
      return;
    }

    const updated = await res.json();
    setUpdatedAt(updated.noteUpdatedAt);
    router.refresh();
  };

  const handleChange = (value: string) => {
    setNote(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => save(value), 800);
  };

  const togglePin = async () => {
    const next = !pinned;
    setPinned(next);

    const res = await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notePinned: next }),
    });

    if (!res.ok) {
      setPinned(!next);
      toast.error("Impossible d'épingler la note.");
      return;
    }

    router.refresh();
  };

  const handleDelete = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setNote("");
    setPinned(false);
    setUpdatedAt(null);

    const res = await fetch(`/api/lists/${listId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: null }),
    });

    if (!res.ok) {
      toast.error("Impossible de supprimer la note.");
      return;
    }

    toast.success("Note supprimée.");
    router.refresh();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {updatedAt
            ? `Dernière modification : ${formatUpdatedAt(updatedAt)}`
            : saving
              ? "Enregistrement..."
              : "Pas encore de note"}
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
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

          {note && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500"
              title="Supprimer la note"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Textarea
        placeholder="Écrire une note pour cette liste..."
        value={note}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-24 border-[#b57edc] focus:ring-[#b57edc]"
      />
    </div>
  );
}
