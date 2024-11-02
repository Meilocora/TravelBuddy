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
  return `${day}.${month}.${year}`;
}

export function formatDurationToDays(startDate: Date, endDate: Date): number {
  return startDate.getDate() - endDate.getDate();
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
