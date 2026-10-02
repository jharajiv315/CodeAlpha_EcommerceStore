/**
 * ID and Date Formatting Utilities
 */

export function generateOrderId(): string {
  const year = new Date().getFullYear();
  const randomSeq = Math.floor(10000 + Math.random() * 90000);
  return `NX-${year}-${randomSeq}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getEstimatedDeliveryDate(daysFromNow: number = 3): string {
  const target = new Date();
  target.setDate(target.getDate() + daysFromNow);
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(target);
}
