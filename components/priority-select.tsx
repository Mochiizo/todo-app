"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PRIORITY_COLORS,
  PRIORITY_EMOJI,
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  type Priority,
} from "@/lib/priority";

export default function PrioritySelect({
  value,
  onChange,
  disabled,
}: {
  value: Priority;
  onChange: (value: Priority) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as Priority)}
      disabled={disabled}
    >
      <SelectTrigger
        size="sm"
        className={cn("border font-medium", PRIORITY_COLORS[value])}
      >
        <SelectValue>
          {PRIORITY_EMOJI[value]} {PRIORITY_LABELS[value]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {PRIORITY_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {PRIORITY_EMOJI[option]} {PRIORITY_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
