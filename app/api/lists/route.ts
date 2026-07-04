import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { PRIORITY_ORDER, type Priority } from "@/lib/priority";

function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && value in PRIORITY_ORDER;
}

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }

  const lists = await prisma.taskList.findMany({
    where: { userId },
    include: { tasks: true, appointments: true },
    orderBy: { date: "desc" },
  });

  return Response.json(lists);
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const date = body?.date;
  const note = typeof body?.note === "string" ? body.note.trim() : "";

  if (!title || !date) {
    return Response.json(
      { error: "Le titre et la date sont requis." },
      { status: 400 }
    );
  }

  const tasks = Array.isArray(body?.tasks)
    ? body.tasks
        .filter((t: { title?: string }) => t?.title?.trim())
        .map(
          (t: { title: string; description?: string; priority?: string }) => ({
            title: t.title.trim(),
            description: t.description?.trim() || null,
            priority: isPriority(t.priority) ? t.priority : "MEDIUM",
          })
        )
    : [];

  const appointments = Array.isArray(body?.appointments)
    ? body.appointments
        .filter(
          (a: {
            clientLastName?: string;
            clientFirstName?: string;
            formation?: string;
            time?: string;
          }) =>
            a?.clientLastName?.trim() &&
            a?.clientFirstName?.trim() &&
            a?.formation?.trim() &&
            a?.time?.trim()
        )
        .map(
          (a: {
            clientLastName: string;
            clientFirstName: string;
            formation: string;
            time: string;
            description?: string;
          }) => ({
            clientLastName: a.clientLastName.trim(),
            clientFirstName: a.clientFirstName.trim(),
            formation: a.formation.trim(),
            time: a.time.trim(),
            description: a.description?.trim() || null,
          })
        )
    : [];

  const list = await prisma.taskList.create({
    data: {
      title,
      date: new Date(date),
      note: note || null,
      noteUpdatedAt: note ? new Date() : null,
      userId,
      tasks: { create: tasks },
      appointments: { create: appointments },
    },
    include: { tasks: true, appointments: true },
  });

  return Response.json(list, { status: 201 });
}
