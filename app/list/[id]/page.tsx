import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { formatDateFr } from "@/lib/date";
import { sortByPriority } from "@/lib/priority";
import {
  getAppointmentDateTime,
  getAppointmentStatus,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
} from "@/lib/appointments";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TaskItem from "@/components/task-item";
import DeleteTaskButton from "@/components/delete-task-button";
import PrintButton from "@/components/print-button";
import ListNoteEditor from "@/components/list-note-editor";
import AddAppointmentForm from "@/components/add-appointment-form";
import AddTaskForm from "@/components/add-task-form";
import DeleteAppointmentButton from "@/components/delete-appointment-button";
import ListPreviewTemplate from "@/components/list-preview-template";

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;
  const listId = Number(id);

  if (Number.isNaN(listId)) {
    notFound();
  }

  const list = await prisma.taskList.findFirst({
    where: { id: listId, userId },
    include: {
      tasks: true,
      appointments: { orderBy: { time: "asc" } },
    },
  });

  if (!list) {
    notFound();
  }

  const done = list.tasks.filter((t) => t.isDone).length;
  const total = list.tasks.length;
  const sortedTasks = sortByPriority(list.tasks);

  return (
    <>
      {/* Screen view */}
      <div className="min-h-screen bg-[#0b1b3a] text-white p-8 space-y-8 print:hidden">
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 -ml-3"
          >
            <Link href="/history">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l&apos;historique
            </Link>
          </Button>

          <PrintButton />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{list.title}</h1>
          <p className="text-white/70 capitalize">
            {formatDateFr(list.date)}
          </p>
        </div>

        <Card className="bg-white text-[#0b1b3a] border-none">
          <CardHeader>
            <CardTitle>Progression</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={total ? (done / total) * 100 : 0}
              className="bg-[#e9ddf7]"
            />
            <p className="mt-2 text-sm text-gray-500">
              {done}/{total} tâches complétées
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white text-[#0b1b3a] border-none">
          <CardHeader>
            <CardTitle>Tâches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              {list.tasks.length === 0 ? (
                <p className="py-6 text-center text-gray-500">
                  Aucune tâche dans cette liste.
                </p>
              ) : (
                sortedTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2">
                    <TaskItem
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      initialDone={task.isDone}
                      initialPriority={task.priority}
                      className="flex-1"
                    />
                    <DeleteTaskButton taskId={task.id} />
                  </div>
                ))
              )}
            </div>

            <AddTaskForm listId={list.id} />
          </CardContent>
        </Card>

        <Card className="bg-white text-[#0b1b3a] border-none">
          <CardHeader>
            <CardTitle>Bloc-notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ListNoteEditor
              listId={list.id}
              initialNote={list.note}
              initialPinned={list.notePinned}
              initialUpdatedAt={
                list.noteUpdatedAt ? list.noteUpdatedAt.toISOString() : null
              }
            />
          </CardContent>
        </Card>

        <Card className="bg-white text-[#0b1b3a] border-none">
          <CardHeader>
            <CardTitle>Rendez-vous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {list.appointments.length === 0 ? (
              <p className="py-4 text-center text-gray-500">
                Aucun rendez-vous pour cette liste.
              </p>
            ) : (
              list.appointments.map((appointment) => {
                const status = getAppointmentStatus(
                  getAppointmentDateTime(list.date, appointment.time),
                  appointment.durationMinutes
                );

                return (
                  <div
                    key={appointment.id}
                    className="flex items-start gap-3 rounded-md border border-gray-100 p-3"
                  >
                    <div className="w-14 shrink-0 pt-0.5 text-sm font-semibold text-gray-500">
                      {appointment.time}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {appointment.clientLastName}{" "}
                          {appointment.clientFirstName}
                        </p>
                        <Badge
                          variant="outline"
                          className={APPOINTMENT_STATUS_COLORS[status]}
                        >
                          {APPOINTMENT_STATUS_LABELS[status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {appointment.formation}
                      </p>
                      {appointment.description && (
                        <p className="text-sm text-gray-500">
                          {appointment.description}
                        </p>
                      )}
                    </div>

                    <DeleteAppointmentButton appointmentId={appointment.id} />
                  </div>
                );
              })
            )}

            <AddAppointmentForm listId={list.id} />
          </CardContent>
        </Card>
      </div>

      {/* Print view */}
      <div className="hidden print:block">
        <ListPreviewTemplate
          title={list.title}
          formattedDate={formatDateFr(list.date)}
          note={list.note}
          tasks={sortedTasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            isDone: task.isDone,
          }))}
          appointments={list.appointments.map((appointment) => ({
            id: appointment.id,
            clientLastName: appointment.clientLastName,
            clientFirstName: appointment.clientFirstName,
            formation: appointment.formation,
            time: appointment.time,
            description: appointment.description,
            status: getAppointmentStatus(
              getAppointmentDateTime(list.date, appointment.time),
              appointment.durationMinutes
            ),
          }))}
        />
      </div>
    </>
  );
}
