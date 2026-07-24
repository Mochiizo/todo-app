import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { formatDateFr } from "@/lib/date";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DeleteListButton from "@/components/delete-list-button";

export default async function HistoryPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const lists = await prisma.taskList.findMany({
    where: { userId },
    include: { tasks: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#0b1b3a] text-white p-8 space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Historique</h1>
        <p className="text-white/70">Toutes vos listes, triées par date.</p>
      </div>

      {lists.length === 0 ? (
        <Card className="bg-[#fdfbf5] text-[#0b1b3a] border-none">
          <CardContent className="py-10 text-center text-gray-500">
            Aucune liste pour le moment.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => {
            const done = list.tasks.filter((t) => t.isDone).length;
            const total = list.tasks.length;

            return (
              <Card
                key={list.id}
                className="bg-[#fdfbf5] text-[#0b1b3a] border-none transition-shadow hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-heading text-base">
                      {list.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500 capitalize">
                      {formatDateFr(list.date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/list/${list.id}`}>Ouvrir</Link>
                    </Button>
                    <DeleteListButton listId={list.id} />
                  </div>
                </CardHeader>

                <CardContent>
                  <Progress
                    value={total ? (done / total) * 100 : 0}
                    className="bg-[#e9ddf7]"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {done}/{total} tâches
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
