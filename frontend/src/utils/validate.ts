import { parseDate } from './formatting';

export function validateIsOver(date: string): boolean {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  return parseDate(date) < tomorrow;
}
