import { DateFormatMode } from '../models';

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

export function formatDateAndTime(date: Date, mode?: string): string {
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  if (mode === DateFormatMode.shortened) {
    const month = String(
      date.toLocaleString('en-US', { month: 'short' }).slice(0, 3)
    ); // Months are zero-based
    return `${day}.${month} - ${hours}:${minutes}`;
  }

  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  return `${day}.${month}.${year} - ${hours}:${minutes}`;
}

export function formatDurationToDays(startDate: Date, endDate: Date): number {
  return startDate.getDate() - endDate.getDate();
}

export function formatCountdown(startDate: Date): string {
  const today = new Date();
  const timeDifference = startDate.getTime() - today.getTime();

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

export function formatProgress(startDate: Date, endDate: Date): number {
  const today = new Date();

  if (today < startDate) {
    return 0;
  } else if (today > endDate) {
    return 1;
  } else {
    const totalDuration = formatDurationToDays(startDate, endDate);
    const daysPassed = formatDurationToDays(startDate, today);

    return daysPassed / totalDuration;
  }
}
