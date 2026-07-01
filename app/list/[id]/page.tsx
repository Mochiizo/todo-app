import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-[#0b1b3a] text-white p-8 space-y-8">
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

      <div>
        <h1 className="text-3xl font-bold">{list.title}</h1>
        <p className="text-white/70 capitalize">{formatDateFr(list.date)}</p>
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
  );
}
