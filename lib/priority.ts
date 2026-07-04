export type Priority = "LOW" | "MEDIUM" | "HIGH";

export const PRIORITY_ORDER: Record<Priority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

export const PRIORITY_OPTIONS: Priority[] = ["HIGH", "MEDIUM", "LOW"];

export const PRIORITY_LABELS: Record<Priority, string> = {
  HIGH: "Haute",
  MEDIUM: "Moyenne",
  LOW: "Faible",
};

export const PRIORITY_EMOJI: Record<Priority, string> = {
  HIGH: "🔴",
  MEDIUM: "🟠",
  LOW: "🟢",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  HIGH: "bg-red-100 text-red-700 border-red-200",
  MEDIUM: "bg-orange-100 text-orange-700 border-orange-200",
  LOW: "bg-green-100 text-green-700 border-green-200",
};

export function sortByPriority<T extends { priority: Priority }>(
  items: T[]
): T[] {
  return [...items].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}
