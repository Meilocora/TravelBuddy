import { DateFormatMode } from '../models';

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// TODO: Might rework this to take string aswell, because backend responsen is also string
export function formatDateString(date: string): string {
  const dateObject = new Date(date);
  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = dateObject.getFullYear();
  return `${year}-${month}-${day}`;
}

export function formatDateAndTime(date: string, mode?: string): string {
  const dateObject = new Date(date);
  const day = String(dateObject.getDate()).padStart(2, '0');
  const year = dateObject.getFullYear();
  const hours = String(dateObject.getHours()).padStart(2, '0');
  const minutes = String(dateObject.getMinutes()).padStart(2, '0');
  if (mode === DateFormatMode.shortened) {
    const month = String(
      dateObject.toLocaleString('en-US', { month: 'short' }).slice(0, 3)
    ); // Months are zero-based
    return `${day}.${month} - ${hours}:${minutes}`;
  }

  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  return `${day}.${month}.${year} - ${hours}:${minutes}`;
}

export function formatDurationToDays(
  startDate: string,
  endDate: string
): number {
  const startDateObject = new Date(startDate);
  const endDateObject = new Date(endDate);

  return (
    (endDateObject.getTime() - startDateObject.getTime()) /
    (1000 * 60 * 60 * 24)
  );
}

export function formatCountdown(startDate: string): string {
  const today = new Date();
  const startDateObject = new Date(startDate);
  const timeDifference = startDateObject.getTime() - today.getTime();

  if (timeDifference < 0) {
    return 'already departed';
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  if (days >= 3) {
    return `${days}d`;
  }

  return `${days}d ${hours}h ${minutes}m`;
}

export function formatProgress(startDate: string, endDate: string): number {
  const today = new Date();
  const startDateObject = new Date(startDate);
  const endDateObject = new Date(endDate);

  if (today < startDateObject) {
    return 0;
  } else if (today > endDateObject) {
    return 1;
  } else {
    const totalDuration = formatDurationToDays(startDate, endDate);
    const daysPassed = formatDurationToDays(startDate, today.toISOString());

    return daysPassed / totalDuration;
  }
}

export function formatStringToList(string: string): string[] {
  return string.split(',').map((item) => item.trim());
}
