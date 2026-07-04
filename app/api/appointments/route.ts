import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const taskListId = Number(body?.taskListId);
  const clientLastName =
    typeof body?.clientLastName === "string"
      ? body.clientLastName.trim()
      : "";
  const clientFirstName =
    typeof body?.clientFirstName === "string"
      ? body.clientFirstName.trim()
      : "";
  const formation =
    typeof body?.formation === "string" ? body.formation.trim() : "";
  const time = typeof body?.time === "string" ? body.time.trim() : "";
  const description =
    typeof body?.description === "string" ? body.description.trim() : "";

  if (
    Number.isNaN(taskListId) ||
    !clientLastName ||
    !clientFirstName ||
    !formation ||
    !time
  ) {
    return Response.json(
      {
        error:
          "La liste, le nom/prénom du client, la formation et l'heure sont requis.",
      },
      { status: 400 }
    );
  }

  const list = await prisma.taskList.findFirst({
    where: { id: taskListId, userId },
  });
  if (!list) {
    return Response.json({ error: "Liste introuvable." }, { status: 404 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      taskListId,
      clientLastName,
      clientFirstName,
      formation,
      time,
      description: description || null,
    },
  });

  return Response.json(appointment, { status: 201 });
}
