"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type RadixSelectOption = { value: string; label: string; description?: string; disabled?: boolean };

type RadixSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: RadixSelectOption[];
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  triggerClassName?: string;
  itemClassName?: string;
  ariaLabel?: string;
};

export function RadixSelectField({ value, onValueChange, placeholder, options, disabled, className, contentClassName, triggerClassName, itemClassName, ariaLabel }: RadixSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <Select.Trigger disabled={disabled} aria-label={ariaLabel} className={cn("field-input group flex items-center justify-between text-left data-[placeholder]:text-muted-soft", triggerClassName, className)}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="text-muted transition-transform group-data-[state=open]:rotate-180"><ChevronDown className="size-4" /></Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content position="popper" sideOffset={8} className={cn("overlay-surface z-9999 w-(--radix-select-trigger-width) overflow-hidden p-2", contentClassName)}>
          <Select.Viewport className="max-h-70 space-y-1 overscroll-contain">
            {options.map((option) => (
              <Select.Item key={option.value} value={option.value} disabled={option.disabled} className={cn("group/item relative flex min-w-0 cursor-pointer select-none items-start gap-3 rounded-[var(--radius-sm)] border border-transparent px-3 py-3 text-sm text-foreground outline-none hover:border-primary/20 hover:bg-primary-soft data-[highlighted]:bg-primary-soft data-[state=checked]:border-primary/20 data-[state=checked]:bg-primary-soft data-[disabled]:pointer-events-none data-[disabled]:opacity-40", itemClassName)}>
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"><Select.ItemIndicator><Check className="size-3.5" /></Select.ItemIndicator></span>
                <div className="min-w-0 flex-1"><Select.ItemText asChild><span className="block truncate">{option.label}</span></Select.ItemText>{option.description ? <span className="mt-0.5 block truncate text-xs text-muted">{option.description}</span> : null}</div>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
