"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { todayISO } from "@/lib/date";

type TaskDraft = { title: string; description: string };

export default function NewList() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayISO());
  const [tasks, setTasks] = useState<TaskDraft[]>([
    { title: "", description: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const addTask = () => {
    setTasks([...tasks, { title: "", description: "" }]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (
    index: number,
    field: keyof TaskDraft,
    value: string
  ) => {
    setTasks(
      tasks.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const hasValidTask = tasks.some((t) => t.title.trim());
  const canSubmit = Boolean(title.trim()) && Boolean(date) && hasValidTask && !submitting;

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Le titre de la liste est requis.");
      return;
    }
    if (!date) {
      toast.error("La date est requise.");
      return;
    }
    if (!hasValidTask) {
      toast.error("Ajoutez au moins une tâche avec un titre.");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        date,
        tasks: tasks
          .filter((t) => t.title.trim())
          .map((t) => ({
            title: t.title.trim(),
            description: t.description.trim(),
          })),
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      toast.error("Impossible de créer la liste.");
      return;
    }

    toast.success("Liste créée !");
    router.push("/history");
  };

  return (
    <div className="min-h-screen bg-[#0b1b3a] text-white p-8 space-y-8 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Nouvelle liste</h1>
        <p className="text-white/70">
          Créez votre liste puis retrouvez-la dans l&apos;historique ou le
          tableau de bord.
        </p>
      </div>

      {/* Informations */}
      <Card className="rounded-2xl shadow-sm bg-white text-[#0b1b3a] border-none">
        <CardHeader>
          <CardTitle className="text-[#0b1b3a]">Informations</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre</label>
            <Input
              placeholder="Courses de la semaine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-[#b57edc] focus:ring-[#b57edc]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-[#b57edc] focus:ring-[#b57edc]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card className="rounded-2xl shadow-sm bg-white text-[#0b1b3a] border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#0b1b3a]">Tâches</CardTitle>

          <Button
            onClick={addTask}
            className="bg-[#b57edc] hover:bg-[#9b5fc9] text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="p-4 border border-[#e5d6f3] rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-[#0b1b3a]">
                  Tâche {index + 1}
                </p>

                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="Supprimer la tâche"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Input
                placeholder="Titre de la tâche"
                value={task.title}
                onChange={(e) => updateTask(index, "title", e.target.value)}
                className="border-[#b57edc] focus:ring-[#b57edc]"
              />

              <Textarea
                placeholder="Description (optionnel)"
                value={task.description}
                onChange={(e) =>
                  updateTask(index, "description", e.target.value)
                }
                className="border-[#b57edc] focus:ring-[#b57edc]"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-[#b57edc] hover:bg-[#9b5fc9] text-white px-6 py-6 text-base disabled:opacity-50"
        >
          {submitting ? "Création..." : "Créer la liste"}
        </Button>
      </div>
    </div>
  );
}
