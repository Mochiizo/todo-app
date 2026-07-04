"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteAppointmentButton({
  appointmentId,
}: {
  appointmentId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/appointments/${appointmentId}`, {
      method: "DELETE",
    });
    setLoading(false);

    if (!res.ok) {
      toast.error("Impossible de supprimer le rendez-vous.");
      return;
    }

    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      className="text-gray-400 hover:text-red-500"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
