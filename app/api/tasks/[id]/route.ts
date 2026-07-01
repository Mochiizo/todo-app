import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    return Response.json({ error: "Tâche introuvable." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const isDone =
    typeof body?.isDone === "boolean" ? body.isDone : !task.isDone;

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { isDone },
  });

  return Response.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const taskId = Number(id);

  if (Number.isNaN(taskId)) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    await prisma.task.delete({ where: { id: taskId } });
  } catch {
    return Response.json({ error: "Tâche introuvable." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
