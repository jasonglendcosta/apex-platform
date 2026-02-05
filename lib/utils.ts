import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in AED
 */
export function formatCurrency(amount: number): string {
  return `AED ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format date in human-readable format
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format date in short format
 */
export function formatDateShort(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get bedroom label
 */
export function getBedroomLabel(bedrooms: number): string {
  if (bedrooms === 0) return 'Studio';
  if (bedrooms === 1) return '1 Bedroom';
  return `${bedrooms} Bedrooms`;
}

/**
 * Calculate days until a date
 */
export function getDaysUntil(dateString: string): number {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is expired
 */
export function isExpired(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Generate a random ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Calculate price per square foot
 */
export function calculatePricePerSqft(price: number, areaSqft: number): number {
  if (areaSqft === 0) return 0;
  return Math.round(price / areaSqft);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, discountAmount: number): string {
  if (originalPrice === 0) return '0';
  return ((discountAmount / originalPrice) * 100).toFixed(1);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Format UAE numbers
  if (cleaned.startsWith('+971') || cleaned.startsWith('971')) {
    const number = cleaned.replace(/^\+?971/, '');
    return `+971 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`;
  }
  
  return phone;
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): { text: string; bg: string } {
  const colors: Record<string, { text: string; bg: string }> = {
    available: { text: 'text-green-600', bg: 'bg-green-100' },
    reserved: { text: 'text-yellow-600', bg: 'bg-yellow-100' },
    booked: { text: 'text-blue-600', bg: 'bg-blue-100' },
    spa_signed: { text: 'text-purple-600', bg: 'bg-purple-100' },
    spa_executed: { text: 'text-indigo-600', bg: 'bg-indigo-100' },
    registered: { text: 'text-teal-600', bg: 'bg-teal-100' },
    sold: { text: 'text-slate-600', bg: 'bg-slate-100' },
    draft: { text: 'text-slate-600', bg: 'bg-slate-100' },
    sent: { text: 'text-blue-600', bg: 'bg-blue-100' },
    viewed: { text: 'text-purple-600', bg: 'bg-purple-100' },
    accepted: { text: 'text-green-600', bg: 'bg-green-100' },
    expired: { text: 'text-orange-600', bg: 'bg-orange-100' },
    rejected: { text: 'text-red-600', bg: 'bg-red-100' },
  };
  
  return colors[status] || { text: 'text-slate-600', bg: 'bg-slate-100' };
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep function for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * Get human-readable status label
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: 'Available',
    reserved: 'Reserved',
    booked: 'Booked',
    spa_signed: 'SPA Signed',
    spa_executed: 'SPA Executed',
    registered: 'Registered',
    sold: 'Sold',
    blocked: 'Blocked',
  };
  return labels[status] || status;
}
