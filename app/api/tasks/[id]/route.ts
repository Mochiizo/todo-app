import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { PRIORITY_ORDER, type Priority } from "@/lib/priority";

type Params = { params: Promise<{ id: string }> };

function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && value in PRIORITY_ORDER;
}

export async function PATCH(request: Request, { params }: Params) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const task = await prisma.task.findFirst({
    where: { id: taskId, taskList: { userId } },
  });
  if (!task) {
    return Response.json({ error: "Tâche introuvable." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const isDone =
    typeof body?.isDone === "boolean" ? body.isDone : !task.isDone;
  const priority = isPriority(body?.priority) ? body.priority : task.priority;

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { isDone, priority },
  });

  return Response.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const task = await prisma.task.findFirst({
    where: { id: taskId, taskList: { userId } },
  });
  if (!task) {
    return Response.json({ error: "Tâche introuvable." }, { status: 404 });
  }

  await prisma.task.delete({ where: { id: taskId } });

  return new Response(null, { status: 204 });
}
