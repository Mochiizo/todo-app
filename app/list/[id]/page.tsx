import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckSquare } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDateFr } from "@/lib/date";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import TaskItem from "@/components/task-item";
import DeleteTaskButton from "@/components/delete-task-button";
import PrintButton from "@/components/print-button";

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listId = Number(id);

  if (Number.isNaN(listId)) {
    notFound();
  }

  const list = await prisma.taskList.findUnique({
    where: { id: listId },
    include: { tasks: true },
  });

  if (!list) {
    notFound();
  }

  const done = list.tasks.filter((t) => t.isDone).length;
  const total = list.tasks.length;

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
          <CardContent className="space-y-1">
            {list.tasks.length === 0 ? (
              <p className="py-6 text-center text-gray-500">
                Aucune tâche dans cette liste.
              </p>
            ) : (
              list.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2">
                  <TaskItem
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    initialDone={task.isDone}
                    className="flex-1"
                  />
                  <DeleteTaskButton taskId={task.id} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Print view */}
      <div className="hidden print:block p-10 text-[#0b1b3a]">
        <div className="flex items-center gap-3 border-b-2 border-[#b57edc] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b57edc] text-white">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold">Tâchable</p>
            <p className="text-sm text-gray-500">Liste de tâches</p>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-2xl font-bold">{list.title}</h1>
          <p className="mt-1 capitalize text-gray-600">
            {formatDateFr(list.date)}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {done}/{total} tâches complétées
          </p>
        </div>

        <ul className="mt-8 space-y-3">
          {list.tasks.map((task) => (
            <li key={task.id} className="flex items-start gap-3 break-inside-avoid">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-[#b57edc] text-xs font-bold ${
                  task.isDone ? "bg-[#b57edc] text-white" : "text-transparent"
                }`}
              >
                ✓
              </span>
              <div>
                <p className={task.isDone ? "line-through text-gray-400" : ""}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-500">{task.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
