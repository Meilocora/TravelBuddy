import { Float } from 'react-native/Libraries/Types/CodegenTypes';

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatQuantity(qty: number): string | null {
  if (!qty) {
    return null;
  } else if (qty < 1000) {
    return qty.toString();
  } else if (qty < 1000000) {
    return (qty / 1000).toFixed(1) + 'k';
  } else {
    return (qty / 1000000).toFixed(1) + 'mio';
  }
}

export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear().toString();
  return `${day}.${month}.${year}`;
}

export function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(year, month - 1, day); // Months are zero-based in JavaScript Date
}

export function formatDateString(date: string): string {
  const dateObject = parseDate(date);
  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = dateObject.getFullYear();
  return `${day}.${month}.${year}`;
}

export function formatDateTimeString(date: string): string {
  const dateObject = parseDateAndTime(date);
  const day = String(dateObject.getDate()).padStart(2, '0');
  const year = dateObject.getFullYear();
  const hours = String(dateObject.getHours()).padStart(2, '0');
  const minutes = String(dateObject.getMinutes()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  return `${day}.${month}.${year} (${hours}:${minutes})`;
}

export function parseDateAndTime(dateString: string): Date {
  const [datestring, time] = dateString.split(/\s/);
  const [day, month, year] = datestring.split('.').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(year, month, day, hours, minutes);
}

export function formatDurationToDays(
  startDate: string,
  endDate: string
): number {
  const startDateObject = parseDate(startDate);
  const endDateObject = parseDate(endDate);

  return (
    (endDateObject.getTime() - startDateObject.getTime()) /
    (1000 * 60 * 60 * 24)
  );
}

export function formatCountdown(startDate: string): string {
  const today = new Date();
  const startDateObject = parseDateAndTime(startDate);
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

export function formatProgress(startDate: string, endDate: string): Float {
  const today = new Date();
  const startDateObject = parseDate(startDate);
  const endDateObject = parseDate(endDate);

  if (today < startDateObject) {
    return 0;
  } else if (today > endDateObject) {
    return 1;
  } else {
    const totalDuration = formatDurationToDays(startDate, endDate);
    const daysPassed = formatDurationToDays(startDate, formatDate(today));

    return parseFloat((daysPassed / totalDuration).toFixed(2));
  }
}

export function formatStringToList(string: string): string[] {
  return string.split(',').map((item) => item.trim());
}
