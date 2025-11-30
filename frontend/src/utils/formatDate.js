// utils/dateUtils.js

// Fixes +1 day issue by forcing LOCAL parsing for YYYY-MM-DD
export const formatDate = (dateString) => {
  if (!dateString) return '-';

  // If dateString is ONLY a date (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day); // Local date (no timezone shift)
    return date.toLocaleDateString('en-IN');
  }

  // If full timestamp exists (YYYY-MM-DDTHH:mm:ss)
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN');
};

// Time formatter (safe for timestamps)
export const formatTime = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

