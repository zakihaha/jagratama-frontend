import { format } from 'date-fns';

export function formatDate(dateString?: string | null, fallback: string = ''): string {
  if (!dateString) {
    return fallback;
  }

  try {
    const date = new Date(dateString);
    // Apr 22, 2025 • 09:15 AM
    return format(date, 'dd MMM yyyy • HH:mm a');
  } catch (error) {
    return fallback;
  }
}
