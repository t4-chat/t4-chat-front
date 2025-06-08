/**
 * Format a date to display in the chat interface
 * Returns time if today, or date + time if not today
 */
export const formatDate = (date: Date): string => {
  const now = new Date();
  const isToday = now.toDateString() === date.toDateString();
  
  if (isToday) {
    return formatTime(date);
  }
  
  return formatDateWithTime(date);
};

/**
 * Format a date as time only (HH:MM)
 */
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format a date with both date and time
 */
const formatDateWithTime = (date: Date): string => {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}; 