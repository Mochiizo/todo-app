import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { todayISO, toISODate } from "@/lib/date";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TaskItem from "@/components/task-item";
import {
  ListTodo,
  CheckCircle2,
  TrendingUp,
  CalendarDays,
  Plus,
} from "lucide-react";

export default async function Home() {
  const today = todayISO();
  const lists = await prisma.taskList.findMany({
    include: { tasks: true },
    orderBy: { date: "desc" },
  });

  const allTasks = lists.flatMap((l) => l.tasks);
  const done = allTasks.filter((t) => t.isDone).length;
  const total = allTasks.length;
  const rate = total ? Math.round((done / total) * 100) : 0;

  const todayLists = lists.filter((l) => toISODate(l.date) === today);
  const pendingToday = todayLists
    .flatMap((l) => l.tasks)
    .filter((t) => !t.isDone).length;

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

      {/* TODAY LISTS */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Aujourd’hui</h2>

        {todayLists.length === 0 ? (
          <Card className="bg-white text-[#0b1b3a] border-none">
            <CardContent className="py-10 text-center text-gray-500">
              Aucune tâche aujourd&apos;hui.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {todayLists.map((list) => (
              <Card
                key={list.id}
                className="bg-white text-[#0b1b3a] border-none"
              >
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-base">{list.title}</CardTitle>

                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/list/${list.id}`}>Ouvrir</Link>
                  </Button>
                </CardHeader>

                <CardContent className="space-y-2">
                  {list.tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      initialDone={task.isDone}
                    />
                  ))}
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
