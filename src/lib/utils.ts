
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to combine Tailwind CSS classes with proper merging logic
 * Optimized to avoid unnecessary operations
 */
export function cn(...inputs: ClassValue[]) {
  // Filter out falsy values before processing
  const filteredInputs = inputs.filter(Boolean);
  if (filteredInputs.length === 0) return '';
  
  return twMerge(clsx(filteredInputs));
}

/**
 * Format date strings consistently
 */
export function formatDate(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Debounce utility to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  
  return (...args: Parameters<T>): void => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
