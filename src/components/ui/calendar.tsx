"use client";

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type DropdownProps,
  type Locale,
} from "react-day-picker";
import { Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaults = getDefaultClassNames();

  return (
    <DayPicker
      {...props}
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      locale={locale}
      className={cn(
        "group/calendar bg-transparent p-2 [--cell-radius:0.95rem] [--cell-size:2.35rem]",
        className,
      )}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit text-foreground", defaults.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaults.months),
        month: cn("flex w-full flex-col gap-4", defaults.month),
        nav: cn(
          "pointer-events-none absolute inset-x-0 top-0 z-30 flex w-full items-center justify-between gap-1",
          defaults.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "pointer-events-auto size-(--cell-size) rounded-xl border border-border bg-card p-0 text-primary shadow-sm select-none hover:border-primary/40 hover:bg-primary-soft hover:text-primary-hover aria-disabled:opacity-50",
          defaults.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "pointer-events-auto size-(--cell-size) rounded-xl border border-border bg-card p-0 text-primary shadow-sm select-none hover:border-primary/40 hover:bg-primary-soft hover:text-primary-hover aria-disabled:opacity-50",
          defaults.button_next,
        ),
        month_caption: cn(
          "pointer-events-none relative z-20 flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaults.month_caption,
        ),
        dropdowns: cn(
          "pointer-events-auto flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-semibold",
          defaults.dropdowns,
        ),
        dropdown_root: cn("relative rounded-(--cell-radius)", defaults.dropdown_root),
        dropdown: cn("absolute inset-0 bg-popover opacity-0", defaults.dropdown),
        caption_label: cn(
          "pointer-events-auto font-semibold tracking-[-0.01em] text-foreground select-none",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted",
          defaults.caption_label,
        ),
        month_grid: "w-full border-separate border-spacing-y-1",
        weekdays: cn("flex", defaults.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) pb-1 text-[0.78rem] font-semibold text-muted select-none",
          defaults.weekday,
        ),
        weeks: cn("flex flex-col", defaults.weeks),
        week: cn("flex w-full", defaults.week),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none",
          defaults.day,
        ),
        range_start: cn("rounded-l-(--cell-radius) bg-primary-soft", defaults.range_start),
        range_middle: cn("rounded-none bg-primary-soft", defaults.range_middle),
        range_end: cn("rounded-r-(--cell-radius) bg-primary-soft", defaults.range_end),
        today: cn(
          "rounded-(--cell-radius) bg-primary-soft text-primary data-[selected=true]:rounded-none",
          defaults.today,
        ),
        outside: cn("text-muted-soft", defaults.outside),
        disabled: cn("text-muted-soft opacity-50", defaults.disabled),
        hidden: cn("invisible", defaults.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", className)} {...iconProps} />
          ) : (
            <ChevronRight className={cn("size-4", className)} {...iconProps} />
          ),
        DayButton: (dayProps) => <CalendarDayButton locale={locale} {...dayProps} />,
        Dropdown: CalendarDropdown,
        ...components,
      }}
    />
  );
}

function CalendarDropdown({ options, value, onChange, disabled }: DropdownProps) {
  const selectedValue = value == null ? "" : String(value);
  const selectedOption = options?.find((option) => String(option.value) === selectedValue);

  return (
    <Select.Root
      value={selectedValue}
      onValueChange={(nextValue) =>
        onChange?.({ target: { value: nextValue }, currentTarget: { value: nextValue } } as React.ChangeEvent<HTMLSelectElement>)
      }
      disabled={disabled}
    >
      <Select.Trigger
        aria-label={selectedOption?.label}
        className="group inline-flex h-9 min-w-17 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2.5 text-sm font-semibold text-foreground shadow-sm outline-none hover:border-primary/40 hover:bg-primary-soft focus:ring-4 focus:ring-primary/15"
      >
        <Select.Value placeholder={selectedOption?.label} />
        <Select.Icon className="text-muted transition-transform group-data-[state=open]:rotate-180">
          <ChevronDown className="size-3.5" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={8}
          className="z-9999 min-w-(--radix-select-trigger-width) overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-[0_24px_70px_hsl(151_42%_16%_/_0.18)]"
        >
          <Select.Viewport className="max-h-65 space-y-1">
            {options?.map((option) => (
              <Select.Item
                key={option.value}
                value={String(option.value)}
                disabled={option.disabled}
                className="group/item relative flex cursor-pointer select-none items-center gap-2 rounded-xl border border-transparent px-2.5 py-2 text-sm font-medium text-foreground outline-none hover:border-primary/20 hover:bg-primary-soft data-[highlighted]:border-primary/20 data-[highlighted]:bg-primary-soft data-[state=checked]:border-primary/20 data-[state=checked]:bg-primary-soft data-[disabled]:pointer-events-none data-[disabled]:opacity-40"
              >
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary">
                  <Select.ItemIndicator><Check className="size-3" /></Select.ItemIndicator>
                </span>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function CalendarDayButton({ className, day, modifiers, locale, ...props }: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-(--cell-radius) border border-transparent bg-transparent leading-none font-medium text-foreground hover:border-primary/25 hover:bg-primary-soft hover:text-primary-hover data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
