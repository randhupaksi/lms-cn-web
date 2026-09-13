"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/cn";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
};

export function DatePickerField({ value, onChange, placeholder = "Pilih tanggal", disabled, className, required }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = value ? parseISO(value) : undefined;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        disabled={disabled}
        aria-required={required}
        className={cn("field-input flex w-full items-center justify-between text-left disabled:cursor-not-allowed disabled:opacity-50", !value && "text-muted-soft", className)}
      >
        <span>{selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: id }) : placeholder}</span>
        <CalendarDays className="size-4 shrink-0 text-primary" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side="bottom" align="start" sideOffset={8} className="isolate z-9999">
          <PopoverPrimitive.Popup className="w-auto rounded-2xl border border-border bg-card p-2.5 text-sm text-foreground shadow-[0_24px_70px_hsl(151_42%_16%_/_0.18)] outline-none">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (!date) return;
                onChange(format(date, "yyyy-MM-dd"));
                setOpen(false);
              }}
            />
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export function DateTimePickerField({ value, onChange, placeholder = "Pilih waktu", disabled, className, required }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const parsed = value ? parseISO(value) : undefined;
  const timeValue = parsed ? format(parsed, "HH:mm") : "09:00";

  function update(nextDate: Date, nextTime = timeValue) {
    const [hours, minutes] = nextTime.split(":").map(Number);
    nextDate.setHours(hours || 0, minutes || 0, 0, 0);
    onChange(format(nextDate, "yyyy-MM-dd'T'HH:mm"));
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        disabled={disabled}
        aria-required={required}
        className={cn("field-input flex w-full items-center justify-between text-left disabled:cursor-not-allowed disabled:opacity-50", !value && "text-muted-soft", className)}
      >
        <span>{parsed ? format(parsed, "d MMM yyyy, HH:mm", { locale: id }) : placeholder}</span>
        <CalendarDays className="size-4 shrink-0 text-primary" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side="bottom" align="start" sideOffset={8} className="isolate z-9999">
          <PopoverPrimitive.Popup className="w-auto rounded-2xl border border-border bg-card p-2.5 text-sm text-foreground shadow-[0_24px_70px_hsl(151_42%_16%_/_0.18)] outline-none">
            <Calendar mode="single" selected={parsed} onSelect={(date) => date && update(date)} />
            <div className="border-t border-border px-2 pt-3">
              <label className="field-label text-xs">
                Waktu
                <input className="field-input" type="time" value={timeValue} onChange={(event) => parsed && update(new Date(parsed), event.target.value)} />
              </label>
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
