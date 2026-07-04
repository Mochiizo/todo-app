import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const listId = Number(id);

  if (Number.isNaN(listId)) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const list = await prisma.taskList.findFirst({
    where: { id: listId, userId },
    include: { tasks: true, appointments: true },
  });

  if (!list) {
    return Response.json({ error: "Liste introuvable." }, { status: 404 });
  }

  return Response.json(list);
}

export async function PATCH(request: Request, { params }: Params) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const listId = Number(id);

  if (Number.isNaN(listId)) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const list = await prisma.taskList.findFirst({
    where: { id: listId, userId },
  });
  if (!list) {
    return Response.json({ error: "Liste introuvable." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const data: {
    note?: string | null;
    notePinned?: boolean;
    noteUpdatedAt?: Date | null;
  } = {};

  if (typeof body?.note === "string" || body?.note === null) {
    const trimmed = typeof body?.note === "string" ? body.note.trim() : "";
    data.note = trimmed || null;
    data.noteUpdatedAt = trimmed ? new Date() : null;
    if (!trimmed) data.notePinned = false;
  }

  if (typeof body?.notePinned === "boolean") {
    data.notePinned = body.notePinned;
  }

  const updated = await prisma.taskList.update({
    where: { id: listId },
    data,
  });

  return Response.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const listId = Number(id);

  if (Number.isNaN(listId)) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const list = await prisma.taskList.findFirst({
    where: { id: listId, userId },
  });
  if (!list) {
    return Response.json({ error: "Liste introuvable." }, { status: 404 });
  }

  await prisma.taskList.delete({ where: { id: listId } });

  return new Response(null, { status: 204 });
}
