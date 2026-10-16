import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format integer Poisha or BDT into Bangladeshi Taka currency display (৳)
 */
export function formatBDT(amount?: number | null, fromPoisha = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '৳0';
  }
  const value = fromPoisha ? amount / 100 : amount;
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace('BDT', '৳');
}

/**
 * Format gold weight in milligrams or grams to clean readable text
 */
export function formatGoldWeight(grams?: number | null, includeBhori = false): string {
  const safeGrams = typeof grams === 'number' && !isNaN(grams) ? grams : 0;
  const formattedGrams = `${safeGrams.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })} g`;

  if (includeBhori && safeGrams >= 1) {
    const bhori = (safeGrams / 11.664).toFixed(3);
    return `${formattedGrams} (${bhori} Bhori)`;
  }
  return formattedGrams;
}

/**
 * Clean human-readable date & time
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}
