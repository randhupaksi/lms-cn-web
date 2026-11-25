import { cn } from "@/lib/cn";

export function BrandMark({
  size = 32,
  className,
}: Readonly<{ size?: number; className?: string }>) {
  return (
    <svg
      aria-hidden="true"
      className={cn("brand-mark-icon", className)}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      focusable="false"
    >
      <path
        d="M7 16.5c5.8-1.6 11.4-.5 17 3.4v19.2c-5.4-3.5-11-4.7-17-3.3V16.5Z"
        fill="currentColor"
        fillOpacity=".14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M41 16.5c-5.8-1.6-11.4-.5-17 3.4v19.2c5.4-3.5 11-4.7 17-3.3V16.5Z"
        fill="currentColor"
        fillOpacity=".22"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M11 22.5c3.2-.5 6.1.2 8.7 1.8M11 28c3.2-.4 6.1.2 8.7 1.8M37 22.5c-3.2-.5-6.1.2-8.7 1.8M37 28c-3.2-.4-6.1.2-8.7 1.8"
        stroke="currentColor"
        strokeOpacity=".62"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24 30c.3-8.4 5.7-14.6 15.1-17.2-.3 9.9-5.4 16.1-15.1 17.6Z"
        fill="hsl(var(--brand-accent))"
      />
      <path
        d="M24 33c2.9-5.6 6.3-9.6 10.5-12.8"
        stroke="hsl(var(--sidebar-end))"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M28.7 10.7c4.1-2 8.5-2 12.1-.4"
        stroke="currentColor"
        strokeOpacity=".72"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="41.3" cy="10.2" r="1.5" fill="hsl(var(--brand-accent))" />
    </svg>
  );
}
