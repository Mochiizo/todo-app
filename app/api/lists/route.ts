import { prisma } from "@/lib/prisma";

export async function GET() {
  const lists = await prisma.taskList.findMany({
    include: { tasks: true },
    orderBy: { date: "desc" },
  });

  return Response.json(lists);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const date = body?.date;

  if (!title || !date) {
    return Response.json(
      { error: "Le titre et la date sont requis." },
      { status: 400 }
    );
  }

  const tasks = Array.isArray(body?.tasks)
    ? body.tasks
        .filter((t: { title?: string }) => t?.title?.trim())
        .map((t: { title: string; description?: string }) => ({
          title: t.title.trim(),
          description: t.description?.trim() || null,
        }))
    : [];

  const list = await prisma.taskList.create({
    data: {
      title,
      date: new Date(date),
      tasks: { create: tasks },
    },
    include: { tasks: true },
  });

  return Response.json(list, { status: 201 });
}
