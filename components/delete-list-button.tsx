"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteListButton({ listId }: { listId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Supprimer cette liste et toutes ses tâches ?")) {
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/lists/${listId}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      toast.error("Impossible de supprimer la liste.");
      return;
    }

    toast.success("Liste supprimée.");
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
