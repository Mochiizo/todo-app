import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const listId = Number(id);

  if (Number.isNaN(listId)) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const list = await prisma.taskList.findUnique({
    where: { id: listId },
    include: { tasks: true },
  });

  if (!list) {
    return Response.json({ error: "Liste introuvable." }, { status: 404 });
  }

  return Response.json(list);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const listId = Number(id);

  if (Number.isNaN(listId)) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  try {
    await prisma.taskList.delete({ where: { id: listId } });
  } catch {
    return Response.json({ error: "Liste introuvable." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
