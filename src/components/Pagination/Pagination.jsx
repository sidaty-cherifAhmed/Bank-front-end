import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Pagination.css";

const SIZES = [10, 20, 50, 100];

// الأرقام التي تظهر: الأولى والأخيرة والحالية وجارتاها، وما بينها "…"
function pageNumbers(current, total) {
  const set = new Set([0, total - 1, current - 1, current, current + 1]);
  const pages = [...set].filter((p) => p >= 0 && p < total).sort((a, b) => a - b);

  const result = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) result.push("gap-" + p);
    result.push(p);
  });
  return result;
}

// page يبدأ من 0 (مثل الخادم)
export default function Pagination({
  page, size, totalPages, totalElements, disabled, onPageChange, onSizeChange,
}) {
  if (totalElements === 0) return null;

  const first = page * size + 1;
  const last = Math.min((page + 1) * size, totalElements);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {first}–{last} of {totalElements}
      </span>

      <div className="pagination-pages">
        <button
          className="page-btn"
          disabled={disabled || page === 0}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>

        {pageNumbers(page, totalPages).map((p) =>
          typeof p === "string" ? (
            <span key={p} className="page-gap">…</span>
          ) : (
            <button
              key={p}
              className={p === page ? "page-btn active" : "page-btn"}
              disabled={disabled}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p + 1}
            </button>
          )
        )}

        <button
          className="page-btn"
          disabled={disabled || page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>

      <label className="pagination-size">
        Rows
        <select
          value={size}
          disabled={disabled}
          onChange={(e) => onSizeChange(Number(e.target.value))}
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
