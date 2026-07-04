import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { todayISO, tomorrowISO, getDayRange } from "@/lib/date";
import { sortByPriority } from "@/lib/priority";
import NewListForm from "@/components/new-list-form";

export default async function NewListPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }

  const { start, end } = getDayRange(todayISO());

  const unfinishedTasks = await prisma.task.findMany({
    where: {
      isDone: false,
      taskList: { userId, date: { gte: start, lt: end } },
    },
  });

  const carriedOverTasks = sortByPriority(unfinishedTasks).map((task) => ({
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    carriedOver: true,
  }));

  return (
    <NewListForm initialTasks={carriedOverTasks} initialDate={tomorrowISO()} />
  );
}
