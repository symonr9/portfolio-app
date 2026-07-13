const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

const monthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

export function formatDate(date: string | null) {
  return formatValidDate(date, fullDateFormatter);
}

export function formatMonthYear(date: string | null) {
  return formatValidDate(date, monthYearFormatter);
}

function formatValidDate(
  date: string | null,
  formatter: Intl.DateTimeFormat,
) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime()) ? date : formatter.format(parsedDate);
}
