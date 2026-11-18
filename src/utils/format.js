// Format a balance: 1250 -> 1,250.00
export function formatMoney(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Conversion result: 2 to 4 decimal places (1,250.5000 -> 1,250.50)
export function formatConverted(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

// Exchange rate: up to 6 decimal places without trailing zeros (3.670000 -> 3.67)
export function formatRate(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

// Relative time for recent items: "just now", "5 min ago", "3 h ago", then the full date
export function timeAgo(value) {
  const seconds = Math.max(0, (Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  return formatDateTime(value);
}

// Date and time: "2026-11-11T12:31:05" -> "11 Nov 2026, 12:31:05"
export function formatDateTime(value) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// Initials of a name (up to two letters): "Ahmed Ali" -> "AA"
export function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}
