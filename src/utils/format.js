// تنسيق الرصيد: 1250 -> 1,250.00
export function formatMoney(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
