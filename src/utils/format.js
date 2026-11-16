// تنسيق الرصيد: 1250 -> 1,250.00
export function formatMoney(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ناتج التحويل: من منزلتين إلى 4 منازل (1,250.5000 -> 1,250.50)
export function formatConverted(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

// سعر الصرف: حتى 6 منازل عشرية بدون أصفار زائدة (3.670000 -> 3.67)
export function formatRate(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

// التاريخ والوقت: "2026-11-11T12:31:05" -> "11 Nov 2026, 12:31:05"
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

// الأحرف الأولى من الاسم (حتى حرفين): "Ahmed Ali" -> "AA"
export function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}
