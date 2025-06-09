import { parseDate, parseDateAndTime } from './formatting';

export function validateIsOver(date: string): boolean {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  return parseDate(date) < tomorrow;
}

export function validateIsOverDateTime(
  comparisonDate: string,
  comparisonDateOffset: string,
  userOffset: number
): boolean {
  const comparisonDateObject = parseDateAndTime(comparisonDate);
  comparisonDateObject.setHours(
    comparisonDateObject.getHours() + Number(comparisonDateOffset)
  );

  const currentDateObject = new Date();
  currentDateObject.setHours(currentDateObject.getHours() + userOffset);

  const timeDifference =
    comparisonDateObject.getTime() - currentDateObject.getTime();
  if (timeDifference > 0) {
    return false;
  } else {
    return true;
  }
}
