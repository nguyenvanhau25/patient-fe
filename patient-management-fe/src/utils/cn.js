import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges standard Tailwind classes with conditional object classes
 * correctly handling Tailwind conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
