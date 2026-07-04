"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddAppointmentForm({ listId }: { listId: number }) {
  const router = useRouter();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [formation, setFormation] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!lastName.trim() || !firstName.trim() || !formation.trim() || !time) {
      toast.error("Le nom, le prénom, la formation et l'heure sont requis.");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskListId: listId,
        clientLastName: lastName.trim(),
        clientFirstName: firstName.trim(),
        formation: formation.trim(),
        time,
        description: description.trim(),
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      toast.error("Impossible d'ajouter le rendez-vous.");
      return;
    }

    setLastName("");
    setFirstName("");
    setFormation("");
    setTime("");
    setDescription("");
    router.refresh();
  };

  return (
    <div className="grid gap-2 rounded-xl border border-[#e5d6f3] p-4 sm:grid-cols-2">
      <Input
        placeholder="Nom"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border-[#b57edc] focus:ring-[#b57edc]"
      />
      <Input
        placeholder="Prénom"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="border-[#b57edc] focus:ring-[#b57edc]"
      />
      <Input
        placeholder="Formation"
        value={formation}
        onChange={(e) => setFormation(e.target.value)}
        className="border-[#b57edc] focus:ring-[#b57edc]"
      />
      <Input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border-[#b57edc] focus:ring-[#b57edc]"
      />
      <Input
        placeholder="Description (optionnel)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border-[#b57edc] focus:ring-[#b57edc] sm:col-span-2"
      />

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-[#b57edc] hover:bg-[#9b5fc9] text-white sm:col-span-2"
      >
        <Plus className="mr-2 h-4 w-4" />
        {submitting ? "Ajout..." : "Ajouter un rendez-vous"}
      </Button>
    </div>
  );
}
