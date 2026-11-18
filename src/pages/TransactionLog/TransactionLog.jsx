import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import api from "../../service/api";
import Pagination from "../../components/Pagination/Pagination";
import { formatDateTime, formatMoney } from "../../utils/format";
import "../ManageUsers/ManageUsers.css";
import "../LoginRegister/LoginRegister.css";
import "../TransferLog/TransferLog.css";
import "./TransactionLog.css";

const DEFAULT_SIZE = 20;

// How each operation type is shown: label, sign and style
const TYPES = {
  DEPOSIT: { label: "Deposit", sign: "+", className: "deposit", icon: <FaArrowDown /> },
  WITHDRAW: { label: "Withdraw", sign: "−", className: "withdraw", icon: <FaArrowUp /> },
};

export default function TransactionLog() {
  // Applied query: any change to it fetches new data from the server
  const [query, setQuery] = useState({ page: 0, size: DEFAULT_SIZE });

  // The result carries the query it was fetched for; if it differs from the current one, we are loading
  const [result, setResult] = useState({ query: null, data: null, error: "" });

  useEffect(() => {
    let cancelled = false; // to ignore a late response to an old query

    api.get("/transactions/log", { params: query })
      .then((res) => {
        if (!cancelled) setResult({ query, data: res.data, error: "" });
      })
      .catch((err) => {
        if (cancelled) return;
        let error = "Failed to load the transaction log";
        if (!err.response) error = "Cannot connect to server";
        else if (err.response.status === 403) error = "You don't have permission";
        setResult({ query, data: null, error });
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const loading = result.query !== query;
  const { data, error } = result;
  const records = data?.content ?? [];

  const goToPage = (page) => setQuery((q) => ({ ...q, page }));
  const changeSize = (size) => setQuery({ page: 0, size });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Transaction Log</h2>
          <p className="page-sub">
            {data ? `${data.totalElements} deposits and withdrawals, newest first` : "Loading..."}
          </p>
        </div>
      </div>

      {error && !loading && <p className="alert-error date-error">{error}</p>}

      {loading && !data ? (
        <div className="spinner" />
      ) : (
        !error && (
          <>
            <div className={loading ? "card table-card is-loading" : "card table-card"}>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date and time</th>
                    <th>Type</th>
                    <th>Account</th>
                    <th className="th-right">Amount</th>
                    <th className="th-right">Balance after</th>
                    <th>By</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 && (
                    <tr>
                      <td colSpan="7" className="cell-empty">No deposits or withdrawals yet</td>
                    </tr>
                  )}
                  {records.map((r) => {
                    // An unknown type (added later on the server) still shows as plain text
                    const t = TYPES[r.type] ?? { label: r.type, sign: "", className: "", icon: null };
                    return (
                      <tr key={r.id}>
                        <td data-label="#" className="cell-id">#{r.id}</td>
                        <td data-label="Date and time" className="cell-date">{formatDateTime(r.dateTime)}</td>
                        <td data-label="Type">
                          <span className={`type-badge ${t.className}`}>
                            {t.icon} {t.label}
                          </span>
                        </td>
                        <td data-label="Account"><span className="account-chip">{r.accountNumber}</span></td>
                        <td data-label="Amount" className={`cell-amount ${t.className}`}>
                          {t.sign} {formatMoney(r.amount)}
                        </td>
                        <td data-label="Balance after" className="cell-balance">{formatMoney(r.balanceAfter)}</td>
                        <td data-label="By">
                          <div className="cell-user">
                            <span className="mini-avatar">{r.userName.slice(0, 2)}</span>
                            <div className="cell-name">@{r.userName}</div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {data && (
              <Pagination
                page={data.page}
                size={data.size}
                totalPages={data.totalPages}
                totalElements={data.totalElements}
                disabled={loading}
                onPageChange={goToPage}
                onSizeChange={changeSize}
              />
            )}
          </>
        )
      )}
    </div>
  );
}
