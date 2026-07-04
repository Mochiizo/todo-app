import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { PRIORITY_ORDER, type Priority } from "@/lib/priority";

function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && value in PRIORITY_ORDER;
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const taskListId = Number(body?.taskListId);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description =
    typeof body?.description === "string" ? body.description.trim() : "";
  const priority = isPriority(body?.priority) ? body.priority : "MEDIUM";

  if (Number.isNaN(taskListId) || !title) {
    return Response.json(
      { error: "La liste et le titre sont requis." },
      { status: 400 }
    );
  }

  const list = await prisma.taskList.findFirst({
    where: { id: taskListId, userId },
  });
  if (!list) {
    return Response.json({ error: "Liste introuvable." }, { status: 404 });
  }

  const task = await prisma.task.create({
    data: {
      taskListId,
      title,
      description: description || null,
      priority,
    },
  });

  return Response.json(task, { status: 201 });
}
