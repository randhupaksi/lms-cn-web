const wibDateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Format an API timestamp in the school's configured timezone. */
export function formatWibDateTime(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Waktu tidak tersedia";
  return `${wibDateTimeFormatter.format(date)} WIB`;
}

/** Convert a datetime-local value entered as WIB wall time into an API instant. */
export function schoolDateTimeToISO(value: string) {
  const date = new Date(`${value}:00+07:00`);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("Tanggal dan waktu sekolah tidak valid.");
  }
  return date.toISOString();
}
