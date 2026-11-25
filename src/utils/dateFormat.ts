import { Priority } from '../types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatShortDate(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (monthIdx < 0 || monthIdx > 11 || Number.isNaN(day)) return iso;
  return `${MONTHS[monthIdx]} ${day}`;
}

export function formatLongDate(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (monthIdx < 0 || monthIdx > 11 || Number.isNaN(day)) return iso;
  return `${MONTHS[monthIdx]} ${day}, ${year}`;
}

export function priorityClasses(priority: Priority): string {
  switch (priority) {
    case 'High':
      return 'bg-priority-high-bg text-priority-high';
    case 'Medium':
      return 'bg-priority-medium-bg text-priority-medium';
    case 'Low':
      return 'bg-priority-low-bg text-priority-low';
  }
}
