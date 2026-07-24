"use client";

import { useState, type KeyboardEvent } from "react";
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
import DecorativeFlower from "@/components/decorative-flower";
import { PRIORITY_EMOJI, type Priority } from "@/lib/priority";

type TaskDraft = {
  title: string;
  description: string;
  priority: Priority;
  carriedOver?: boolean;
};
type AppointmentDraft = {
  lastName: string;
  firstName: string;
  formation: string;
  time: string;
  description: string;
};

const emptyTaskDraft: TaskDraft = {
  title: "",
  description: "",
  priority: "MEDIUM",
};
const emptyAppointmentDraft: AppointmentDraft = {
  lastName: "",
  firstName: "",
  formation: "",
  time: "",
  description: "",
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
  const [tasks, setTasks] = useState<TaskDraft[]>(initialTasks ?? []);
  const [taskDraft, setTaskDraft] = useState<TaskDraft>(emptyTaskDraft);
  const [appointments, setAppointments] = useState<AppointmentDraft[]>([]);
  const [appointmentDraft, setAppointmentDraft] = useState<AppointmentDraft>(
    emptyAppointmentDraft
  );
  const [submitting, setSubmitting] = useState(false);

  const commitTaskDraft = () => {
    if (!taskDraft.title.trim()) return;
    setTasks([...tasks, taskDraft]);
    setTaskDraft(emptyTaskDraft);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleTaskTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTaskDraft();
    }
  };

  const isAppointmentDraftValid = (a: AppointmentDraft) =>
    Boolean(a.lastName.trim() && a.firstName.trim() && a.formation.trim() && a.time);

  const commitAppointmentDraft = () => {
    if (!isAppointmentDraftValid(appointmentDraft)) return;
    setAppointments([...appointments, appointmentDraft]);
    setAppointmentDraft(emptyAppointmentDraft);
  };

  const removeAppointment = (index: number) => {
    setAppointments(appointments.filter((_, i) => i !== index));
  };

  const pendingTask = taskDraft.title.trim() ? taskDraft : null;
  const pendingAppointment = isAppointmentDraftValid(appointmentDraft)
    ? appointmentDraft
    : null;

  const allTasks = pendingTask ? [...tasks, pendingTask] : tasks;
  const allAppointments = pendingAppointment
    ? [...appointments, pendingAppointment]
    : appointments;

  const hasValidTask = allTasks.some((t) => t.title.trim());
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
        note: note.trim(),
        tasks: allTasks
          .filter((t) => t.title.trim())
          .map((t) => ({
            title: t.title.trim(),
            description: t.description.trim(),
            priority: t.priority,
          })),
        appointments: allAppointments
          .filter(isAppointmentDraftValid)
          .map((a) => ({
            clientLastName: a.lastName.trim(),
            clientFirstName: a.firstName.trim(),
            formation: a.formation.trim(),
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

  const previewTasks = allTasks
    .filter((t) => t.title.trim())
    .map((t, index) => ({
      id: index,
      title: t.title,
      description: t.description,
      priority: t.priority,
    }));

  const previewAppointments = allAppointments
    .filter(isAppointmentDraftValid)
    .map((a, index) => ({
      id: index,
      clientLastName: a.lastName,
      clientFirstName: a.firstName,
      formation: a.formation,
      time: a.time,
      description: a.description,
    }));

  return (
    <div className="min-h-screen w-full bg-[#0b1b3a] p-8 text-white">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          {/* Header */}
          <div className="relative">
            <DecorativeFlower
              color="#b57edc"
              className="pointer-events-none absolute -top-8 left-48 h-20 w-20 rotate-[10deg] opacity-20"
            />
            <h1 className="font-heading relative text-3xl font-bold text-white">
              Nouvelle liste
            </h1>
            <p className="relative text-white/70">
              Créez votre liste puis retrouvez-la dans l&apos;historique ou le
              tableau de bord.
            </p>
          </div>

          {/* Informations */}
          <Card className="rounded-2xl shadow-sm bg-[#fdfbf5] text-[#0b1b3a] border-none">
            <CardHeader>
              <CardTitle className="font-heading text-[#0b1b3a]">
                Informations
              </CardTitle>
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
          <Card className="rounded-2xl shadow-sm bg-[#fdfbf5] text-[#0b1b3a] border-none">
            <CardHeader>
              <CardTitle className="font-heading text-[#0b1b3a]">
                Tâches
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {tasks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tasks.map((task, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#f5effc] py-1 pr-2 pl-3 text-sm text-[#0b1b3a]"
                    >
                      {PRIORITY_EMOJI[task.priority]} {task.title}
                      {task.carriedOver && (
                        <Undo2 className="h-3 w-3 text-[#b57edc]" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Supprimer la tâche"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Titre de la tâche"
                  value={taskDraft.title}
                  onKeyDown={handleTaskTitleKeyDown}
                  onChange={(e) =>
                    setTaskDraft({ ...taskDraft, title: e.target.value })
                  }
                  className="border-[#b57edc] focus:ring-[#b57edc]"
                />
                <PrioritySelect
                  value={taskDraft.priority}
                  onChange={(priority) =>
                    setTaskDraft({ ...taskDraft, priority })
                  }
                />
              </div>

              <Input
                placeholder="Description (optionnel)"
                value={taskDraft.description}
                onKeyDown={handleTaskTitleKeyDown}
                onChange={(e) =>
                  setTaskDraft({ ...taskDraft, description: e.target.value })
                }
                className="border-[#b57edc] focus:ring-[#b57edc]"
              />

              <Button
                onClick={commitTaskDraft}
                disabled={!taskDraft.title.trim()}
                className="bg-[#b57edc] hover:bg-[#9b5fc9] text-white disabled:opacity-50"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter la tâche
              </Button>
            </CardContent>
          </Card>

          {/* Bloc-notes */}
          <Card className="rounded-2xl shadow-sm bg-[#fdfbf5] text-[#0b1b3a] border-none">
            <CardHeader>
              <CardTitle className="font-heading text-[#0b1b3a]">
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
          <Card className="rounded-2xl shadow-sm bg-[#fdfbf5] text-[#0b1b3a] border-none">
            <CardHeader>
              <CardTitle className="font-heading text-[#0b1b3a]">
                Rendez-vous (optionnel)
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {appointments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {appointments.map((appointment, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#f5effc] py-1 pr-2 pl-3 text-sm text-[#0b1b3a]"
                    >
                      {appointment.time} · {appointment.lastName}{" "}
                      {appointment.firstName}
                      <button
                        type="button"
                        onClick={() => removeAppointment(index)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Supprimer le rendez-vous"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Nom du client"
                  value={appointmentDraft.lastName}
                  onChange={(e) =>
                    setAppointmentDraft({
                      ...appointmentDraft,
                      lastName: e.target.value,
                    })
                  }
                  className="border-[#b57edc] focus:ring-[#b57edc]"
                />
                <Input
                  placeholder="Prénom du client"
                  value={appointmentDraft.firstName}
                  onChange={(e) =>
                    setAppointmentDraft({
                      ...appointmentDraft,
                      firstName: e.target.value,
                    })
                  }
                  className="border-[#b57edc] focus:ring-[#b57edc]"
                />
                <Input
                  placeholder="Formation"
                  value={appointmentDraft.formation}
                  onChange={(e) =>
                    setAppointmentDraft({
                      ...appointmentDraft,
                      formation: e.target.value,
                    })
                  }
                  className="border-[#b57edc] focus:ring-[#b57edc]"
                />
                <Input
                  type="time"
                  value={appointmentDraft.time}
                  onChange={(e) =>
                    setAppointmentDraft({
                      ...appointmentDraft,
                      time: e.target.value,
                    })
                  }
                  className="border-[#b57edc] focus:ring-[#b57edc]"
                />
              </div>

              <Input
                placeholder="Description (optionnel)"
                value={appointmentDraft.description}
                onChange={(e) =>
                  setAppointmentDraft({
                    ...appointmentDraft,
                    description: e.target.value,
                  })
                }
                className="border-[#b57edc] focus:ring-[#b57edc]"
              />

              <Button
                onClick={commitAppointmentDraft}
                disabled={!isAppointmentDraftValid(appointmentDraft)}
                className="bg-[#b57edc] hover:bg-[#9b5fc9] text-white disabled:opacity-50"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter le rendez-vous
              </Button>
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

        {/* Live preview */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="font-heading mb-3 text-sm font-medium text-white/70">
            Aperçu
          </p>
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
