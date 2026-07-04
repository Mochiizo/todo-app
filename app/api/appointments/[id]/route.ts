import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return Response.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const appointmentId = Number(id);

  if (Number.isNaN(appointmentId)) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, taskList: { userId } },
  });
  if (!appointment) {
    return Response.json(
      { error: "Rendez-vous introuvable." },
      { status: 404 }
    );
  }

  await prisma.appointment.delete({ where: { id: appointmentId } });

  return new Response(null, { status: 204 });
}
