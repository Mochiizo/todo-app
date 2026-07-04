"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Undo2 } from "lucide-react";
import { todayISO, formatDateFr } from "@/lib/date";
import PrioritySelect from "@/components/priority-select";
import ListPreviewTemplate from "@/components/list-preview-template";
import type { Priority } from "@/lib/priority";

type TaskDraft = {
  title: string;
  description: string;
  priority: Priority;
  carriedOver?: boolean;
};
type AppointmentDraft = {
  firstName: string;
  lastName: string;
  time: string;
  description: string;
};

export default function NewListForm({
  initialTasks,
  initialDate,
}: {
  initialTasks?: TaskDraft[];
  initialDate?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(initialDate ?? todayISO());
  const [note, setNote] = useState("");
  const [tasks, setTasks] = useState<TaskDraft[]>(
    initialTasks && initialTasks.length > 0
      ? initialTasks
      : [{ title: "", description: "", priority: "MEDIUM" }]
  );
  const [appointments, setAppointments] = useState<AppointmentDraft[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const addTask = () => {
    setTasks([...tasks, { title: "", description: "", priority: "MEDIUM" }]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setTasks(
      tasks.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const updateTaskPriority = (index: number, priority: Priority) => {
    setTasks(tasks.map((t, i) => (i === index ? { ...t, priority } : t)));
  };

  const addAppointment = () => {
    setAppointments([
      ...appointments,
      { firstName: "", lastName: "", time: "", description: "" },
    ]);
  };

  const removeAppointment = (index: number) => {
    setAppointments(appointments.filter((_, i) => i !== index));
  };

  const updateAppointment = (
    index: number,
    field: keyof AppointmentDraft,
    value: string
  ) => {
    setAppointments(
      appointments.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  const hasValidTask = tasks.some((t) => t.title.trim());
  const canSubmit =
    Boolean(title.trim()) && Boolean(date) && hasValidTask && !submitting;

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
        note: note.trim(),
        tasks: tasks
          .filter((t) => t.title.trim())
          .map((t) => ({
            title: t.title.trim(),
            description: t.description.trim(),
            priority: t.priority,
          })),
        appointments: appointments
          .filter((a) => a.firstName.trim() && a.lastName.trim() && a.time)
          .map((a) => ({
            clientFirstName: a.firstName.trim(),
            clientLastName: a.lastName.trim(),
            time: a.time,
            description: a.description.trim(),
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

  const previewTasks = tasks
    .filter((t) => t.title.trim())
    .map((t, index) => ({
      id: index,
      title: t.title,
      description: t.description,
      priority: t.priority,
    }));

  const previewAppointments = appointments
    .filter((a) => a.firstName.trim() && a.lastName.trim() && a.time)
    .map((a, index) => ({
      id: index,
      clientFirstName: a.firstName,
      clientLastName: a.lastName,
      time: a.time,
      description: a.description,
    }));

  return (
    <div className="min-h-screen w-full bg-[#0b1b3a] p-8 text-white">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8">
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
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#0b1b3a]">
                        Tâche {index + 1}
                      </p>
                      {task.carriedOver && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f5effc] px-2 py-0.5 text-xs font-medium text-[#b57edc]">
                          <Undo2 className="h-3 w-3" />
                          Reporté d&apos;hier
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <PrioritySelect
                        value={task.priority}
                        onChange={(priority) =>
                          updateTaskPriority(index, priority)
                        }
                      />

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

          {/* Bloc-notes */}
          <Card className="rounded-2xl shadow-sm bg-white text-[#0b1b3a] border-none">
            <CardHeader>
              <CardTitle className="text-[#0b1b3a]">
                Bloc-notes (optionnel)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Une note libre associée à cette liste..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border-[#b57edc] focus:ring-[#b57edc] min-h-24"
              />
            </CardContent>
          </Card>

          {/* Rendez-vous */}
          <Card className="rounded-2xl shadow-sm bg-white text-[#0b1b3a] border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#0b1b3a]">
                Rendez-vous (optionnel)
              </CardTitle>

              <Button
                onClick={addAppointment}
                className="bg-[#b57edc] hover:bg-[#9b5fc9] text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </CardHeader>

            {appointments.length > 0 && (
              <CardContent className="space-y-6">
                {appointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="p-4 border border-[#e5d6f3] rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-[#0b1b3a]">
                        Rendez-vous {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeAppointment(index)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Supprimer le rendez-vous"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input
                        placeholder="Prénom du client"
                        value={appointment.firstName}
                        onChange={(e) =>
                          updateAppointment(index, "firstName", e.target.value)
                        }
                        className="border-[#b57edc] focus:ring-[#b57edc]"
                      />
                      <Input
                        placeholder="Nom du client"
                        value={appointment.lastName}
                        onChange={(e) =>
                          updateAppointment(index, "lastName", e.target.value)
                        }
                        className="border-[#b57edc] focus:ring-[#b57edc]"
                      />
                      <Input
                        type="time"
                        value={appointment.time}
                        onChange={(e) =>
                          updateAppointment(index, "time", e.target.value)
                        }
                        className="border-[#b57edc] focus:ring-[#b57edc]"
                      />
                    </div>

                    <Textarea
                      placeholder="Description (optionnel)"
                      value={appointment.description}
                      onChange={(e) =>
                        updateAppointment(index, "description", e.target.value)
                      }
                      className="border-[#b57edc] focus:ring-[#b57edc]"
                    />
                  </div>
                ))}
              </CardContent>
            )}
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

        {/* Live preview */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-sm font-medium text-white/70">Aperçu</p>
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <ListPreviewTemplate
              title={title}
              formattedDate={date ? formatDateFr(date) : undefined}
              note={note}
              tasks={previewTasks}
              appointments={previewAppointments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
