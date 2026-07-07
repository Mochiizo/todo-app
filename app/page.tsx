import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { todayISO, toISODate, getDayRange } from "@/lib/date";
import { sortByPriority } from "@/lib/priority";
import {
  getAppointmentDateTime,
  getAppointmentStatus,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
} from "@/lib/appointments";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import TaskItem from "@/components/task-item";
import DeleteAppointmentButton from "@/components/delete-appointment-button";
import NoteCardActions from "@/components/note-card-actions";
import {
  ListTodo,
  CheckCircle2,
  TrendingUp,
  CalendarDays,
  Plus,
  StickyNote,
} from "lucide-react";

export default async function Home() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const today = todayISO();
  const { start: dayStart, end: dayEnd } = getDayRange(today);

  const [lists, appointments] = await Promise.all([
    prisma.taskList.findMany({
      where: { userId },
      include: { tasks: true },
      orderBy: { date: "desc" },
    }),
    prisma.appointment.findMany({
      where: { taskList: { userId, date: { gte: dayStart, lt: dayEnd } } },
      include: { taskList: true },
      orderBy: { time: "asc" },
    }),
  ]);

  const allTasks = lists.flatMap((l) => l.tasks);
  const done = allTasks.filter((t) => t.isDone).length;
  const total = allTasks.length;
  const rate = total ? Math.round((done / total) * 100) : 0;

  const todayLists = lists.filter((l) => toISODate(l.date) === today);
  const pendingToday = todayLists
    .flatMap((l) => l.tasks)
    .filter((t) => !t.isDone).length;

  const notesList = [...lists]
    .filter((l) => l.note)
    .sort((a, b) => {
      if (a.notePinned !== b.notePinned) return a.notePinned ? -1 : 1;
      const aTime = a.noteUpdatedAt?.getTime() ?? 0;
      const bTime = b.noteUpdatedAt?.getTime() ?? 0;
      return bTime - aTime;
    });

  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-[#0b1b3a] text-white p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-white/60 text-sm">{formattedDate}</p>
          <h1 className="mt-1 text-4xl font-semibold">Bonjour 👋</h1>
        </div>

        <Button asChild className="bg-[#b57edc] hover:bg-[#9b5fc9] text-white">
          <Link href="/new-list">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle liste
          </Link>
        </Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<ListTodo />} label="Listes" value={lists.length} />
        <StatCard
          icon={<CheckCircle2 />}
          label="Tâches faites"
          value={`${done}/${total}`}
        />
        <StatCard icon={<TrendingUp />} label="Efficacité" value={`${rate}%`} />
        <StatCard
          icon={<CalendarDays />}
          label="À venir aujourd'hui"
          value={pendingToday}
        />
      </div>

      {/* PROGRESS */}
      <Card className="bg-white text-[#0b1b3a] border-none">
        <CardHeader>
          <CardTitle>Progression globale</CardTitle>
        </CardHeader>

        <CardContent>
          <Progress value={rate} className="bg-[#e9ddf7]" />

          <p className="mt-2 text-sm text-gray-500">
            {done} tâches complétées sur {total}
          </p>
        </CardContent>
      </Card>

      {/* RENDEZ-VOUS + AUJOURD'HUI */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* RENDEZ-VOUS DU JOUR */}
        <Card className="bg-white text-[#0b1b3a] border-none">
          <CardHeader>
            <CardTitle>Rendez-vous du jour</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {appointments.length === 0 ? (
              <p className="py-6 text-center text-gray-500">
                Aucun rendez-vous aujourd&apos;hui.
              </p>
            ) : (
              appointments.map((appointment) => {
                const status = getAppointmentStatus(
                  getAppointmentDateTime(
                    appointment.taskList.date,
                    appointment.time
                  ),
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
                      <p className="text-xs text-gray-400">
                        {appointment.taskList.title}
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
          </CardContent>
        </Card>

        {/* TODAY LISTS */}
        <Card className="bg-white text-[#0b1b3a] border-none">
          <CardHeader>
            <CardTitle>Aujourd&apos;hui</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayLists.length === 0 ? (
              <p className="py-6 text-center text-gray-500">
                Aucune tâche aujourd&apos;hui.
              </p>
            ) : (
              todayLists.map((list) => (
                <div key={list.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{list.title}</p>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/list/${list.id}`}>Ouvrir</Link>
                    </Button>
                  </div>

                  {sortByPriority(list.tasks).map((task) => (
                    <TaskItem
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      initialDone={task.isDone}
                      initialPriority={task.priority}
                    />
                  ))}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* BLOC-NOTES */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
          <StickyNote className="h-5 w-5" />
          Notes
        </h2>

        {notesList.length === 0 ? (
          <Card className="bg-white text-[#0b1b3a] border-none">
            <CardContent className="py-10 text-center text-gray-500">
              Aucune note pour le moment. Ajoutez-en une depuis une liste.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notesList.map((list) => (
              <Card
                key={list.id}
                className="h-fit min-w-0 bg-white text-[#0b1b3a] border-none"
              >
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <Link
                    href={`/list/${list.id}`}
                    className="text-sm font-semibold hover:underline"
                  >
                    {list.title}
                  </Link>
                  <NoteCardActions listId={list.id} pinned={list.notePinned} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap break-words text-gray-600">
                    {list.note}
                  </p>
                  {list.noteUpdatedAt && (
                    <p className="mt-3 text-xs text-gray-400">
                      Modifiée le{" "}
                      {list.noteUpdatedAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* STAT CARD */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="bg-white text-[#0b1b3a] border-none">
      <CardContent className="py-5">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {icon}
          {label}
        </div>

        <div className="mt-2 text-3xl font-semibold text-[#0b1b3a]">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
