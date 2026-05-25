// utils/date.ts
export const formatDate = (date: string | Date, formatStr: string): string => {
  const d = new Date(date);

  const map: Record<string, string> = {
    d: String(d.getDate()),
    dd: String(d.getDate()).padStart(2, "0"),
    MMM: d.toLocaleString("en-US", { month: "short" }),
    MMMM: d.toLocaleString("en-US", { month: "long" }),
    yyyy: String(d.getFullYear()),
    h: String(d.getHours() % 12 || 12),
    hh: String(d.getHours() % 12 || 12).padStart(2, "0"),
    mm: String(d.getMinutes()).padStart(2, "0"),
    a: d.getHours() >= 12 ? "PM" : "AM",
  };

  return formatStr.replace(
    /d{1,2}|MMM|MMMM|yyyy|h{1,2}|mm|a/g,
    (match) => map[match]
  );
};

export const timeLeft = (targetDate: string | Date): string => {
  const now = Date.now();
  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) return "Live Now";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return "Live Now";
};

export const isQuizLive = (
  start: string | Date,
  end: string | Date
): boolean => {
  const now = Date.now();
  return now >= new Date(start).getTime() && now <= new Date(end).getTime();
};

export const isQuizUpcoming = (start: string | Date): boolean => {
  return Date.now() < new Date(start).getTime();
};

export const isQuizEnded = (end: string | Date): boolean => {
  return Date.now() > new Date(end).getTime();
};
