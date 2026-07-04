export type AppointmentStatus = "upcoming" | "ongoing" | "done";

export function getAppointmentDateTime(listDate: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(listDate);
  combined.setHours(hours || 0, minutes || 0, 0, 0);
  return combined;
}

export function getAppointmentStatus(
  startAt: Date,
  durationMinutes: number,
  now: Date = new Date()
): AppointmentStatus {
  const endAt = new Date(startAt.getTime() + durationMinutes * 60_000);

  if (now < startAt) return "upcoming";
  if (now < endAt) return "ongoing";
  return "done";
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  upcoming: "À venir",
  ongoing: "En cours",
  done: "Terminé",
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  upcoming: "bg-blue-100 text-blue-700 border-blue-200",
  ongoing: "bg-green-100 text-green-700 border-green-200",
  done: "bg-gray-100 text-gray-500 border-gray-200",
};
