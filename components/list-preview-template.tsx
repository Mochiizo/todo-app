import DecorativeFlower from "@/components/decorative-flower";
import { PRIORITY_EMOJI, PRIORITY_LABELS, type Priority } from "@/lib/priority";
import { APPOINTMENT_STATUS_LABELS, type AppointmentStatus } from "@/lib/appointments";
import { cn } from "@/lib/utils";

export type PreviewTask = {
  id: string | number;
  title: string;
  description?: string | null;
  priority: Priority;
  isDone?: boolean;
};

export type PreviewAppointment = {
  id: string | number;
<<<<<<< HEAD
  clientLastName: string;
  clientFirstName: string;
  formation: string;
=======
  clientFirstName: string;
  clientLastName: string;
>>>>>>> 36e9a0623db006bf4bd3336ac224cca748246e2a
  time: string;
  description?: string | null;
  status?: AppointmentStatus;
};

function EmptySectionMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center text-center">
      <p className="text-3xl font-bold text-[#b57edc]">{children}</p>
    </div>
  );
}

export default function ListPreviewTemplate({
  title,
  formattedDate,
  note,
  tasks,
  appointments,
  className,
}: {
  title: string;
  formattedDate?: string;
  note?: string | null;
  tasks: PreviewTask[];
  appointments: PreviewAppointment[];
  className?: string;
}) {
  const total = tasks.length;

  return (
    <div
      className={cn(
        "print-grid relative overflow-hidden p-14 text-[#0b1b3a]",
        className
      )}
    >
      <DecorativeFlower
        color="#b57edc"
        className="absolute -top-6 -left-6 h-28 w-28 -rotate-[15deg] opacity-70"
      />
      <DecorativeFlower
        color="#e9ddf7"
        className="absolute top-2 right-16 h-16 w-16 rotate-[20deg] opacity-80"
      />
      <DecorativeFlower
        color="#b57edc"
        className="absolute -right-8 bottom-6 h-32 w-32 rotate-[12deg] opacity-60"
      />

      {/* Header */}
      <div className="relative text-center">
        <h1 className="text-5xl font-extrabold text-[#0b1b3a]">
          {title || "Nouvelle liste"}
        </h1>
        {formattedDate && (
          <p className="mt-2 text-lg capitalize text-gray-500">
            {formattedDate}
          </p>
        )}
        
      </div>

      {/* Tasks */}
      <div className="relative mt-10 break-inside-avoid">
        <h2 className="text-3xl font-extrabold text-[#b57edc]">Tâches</h2>
        {total > 0 ? (
          <ul className="mt-3 space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start gap-3 break-inside-avoid"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-[#b57edc] text-xs font-bold",
                    task.isDone
                      ? "bg-[#b57edc] text-white"
                      : "bg-white text-transparent"
                  )}
                >
                  ✓
                </span>
                <div>
                  <p
                    className={cn(
                      "text-lg font-semibold",
                      task.isDone && "text-gray-400 line-through"
                    )}
                  >
                    {PRIORITY_EMOJI[task.priority]} {task.title}{" "}
                    <span className="text-sm font-normal text-gray-400">
                      ({PRIORITY_LABELS[task.priority]})
                    </span>
                  </p>
                  {task.description && (
                    <p className="text-base text-gray-500">
                      {task.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptySectionMessage>Aucune tâche aujourd&apos;hui</EmptySectionMessage>
        )}
      </div>

      {/* Rendez-vous */}
      <div className="relative mt-10 break-inside-avoid">
        <h2 className="text-3xl font-extrabold text-[#b57edc]">
          Rendez-vous
        </h2>
        {appointments.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="flex items-start gap-3 border-b border-dashed border-[#e5d6f3] pb-2"
              >
                <span className="w-16 shrink-0 text-base font-semibold">
                  {appointment.time}
                </span>
                <div className="flex-1">
                  <p className="text-lg font-medium">
<<<<<<< HEAD
                    {appointment.clientLastName}{" "}
                    {appointment.clientFirstName}{" "}
=======
                    {appointment.clientFirstName}{" "}
                    {appointment.clientLastName}{" "}
>>>>>>> 36e9a0623db006bf4bd3336ac224cca748246e2a
                    {appointment.status && (
                      <span className="text-sm font-normal text-gray-400">
                        ({APPOINTMENT_STATUS_LABELS[appointment.status]})
                      </span>
                    )}
                  </p>
<<<<<<< HEAD
                  <p className="text-sm text-gray-500">
                    {appointment.formation}
                  </p>
=======
>>>>>>> 36e9a0623db006bf4bd3336ac224cca748246e2a
                  {appointment.description && (
                    <p className="text-sm text-gray-500">
                      {appointment.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptySectionMessage>
            Aucun rendez-vous aujourd&apos;hui
          </EmptySectionMessage>
        )}
      </div>

      {/* Bloc-notes */}
      <div className="relative mt-10 break-inside-avoid rounded-xl border-2 border-dashed border-[#b57edc] bg-[#f8f3fc] p-4">
        <h2 className="text-2xl font-extrabold text-[#b57edc]">Bloc-notes</h2>
        {note ? (
          <p className="mt-1 text-base whitespace-pre-wrap text-gray-700">
            {note}
          </p>
        ) : (
          <EmptySectionMessage>Aucune note aujourd&apos;hui</EmptySectionMessage>
        )}
      </div>
    </div>
  );
}
