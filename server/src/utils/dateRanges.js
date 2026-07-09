export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfWeek(date) {
  const day = date.getDay();
  const normalized = startOfDay(date);
  normalized.setDate(normalized.getDate() - day);
  return normalized;
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

export function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function getMonthRange(monthValue) {
  const fallback = new Date();
  const [year, month] = typeof monthValue === "string" ? monthValue.split("-").map(Number) : [];
  const safeYear = Number.isInteger(year) ? year : fallback.getFullYear();
  const safeMonth = Number.isInteger(month) ? month - 1 : fallback.getMonth();
  const start = new Date(safeYear, safeMonth, 1);
  const end = new Date(safeYear, safeMonth + 1, 1);

  return { start, end };
}

export function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
