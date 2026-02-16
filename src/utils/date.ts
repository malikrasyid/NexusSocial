export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 1. Less than a minute
  if (diffInSeconds < 60) {
    return 'Just now';
  }

  // 2. Less than an hour (e.g., "15m")
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  // 3. Less than 24 hours (e.g., "4h")
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  // 4. Less than 7 days (e.g., "3d")
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  // 5. Older than a week (e.g., "Jan 20" or "Nov 12, 2023")
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  };
  return date.toLocaleDateString('en-US', options);
};