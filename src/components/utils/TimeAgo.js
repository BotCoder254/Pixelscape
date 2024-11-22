import { formatDistanceToNow } from 'date-fns';

export function TimeAgo({ date }) {
  if (!date) return null;
  return formatDistanceToNow(date, { addSuffix: true });
} 