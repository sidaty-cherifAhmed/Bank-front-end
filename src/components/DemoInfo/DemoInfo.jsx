import { useEffect, useRef, useState } from "react";
import { FaInfo, FaChevronDown, FaCopy, FaCheck, FaMagic } from "react-icons/fa";
import { DEMO_ACCOUNT } from "../../config/demoAccount";
import "./DemoInfo.css";

// Banner above the login form: an animated info icon that opens the demo account details.
// onFill({ username, password }) fills the login form with the demo credentials.
export default function DemoInfo({ onFill }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(""); // which value was just copied: "username" | "password"
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (key) => {
    try {
      await navigator.clipboard.writeText(DEMO_ACCOUNT[key]);
      setCopied(key);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(""), 1500);
    } catch {
      // Clipboard can be blocked (e.g. insecure context): the value is still visible to copy by hand
    }
  };

  const row = (key, label) => (
    <div className="demo-row">
      <span className="demo-label">{label}</span>
      <code className="demo-value">{DEMO_ACCOUNT[key]}</code>
      <button
        type="button"
        className={copied === key ? "demo-copy done" : "demo-copy"}
        onClick={() => copy(key)}
        aria-label={`Copy ${label.toLowerCase()}`}
      >
        {copied === key ? <FaCheck /> : <FaCopy />}
      </button>
    </div>
  );

  return (
    <div className={open ? "demo-info open" : "demo-info"}>
      <button
        type="button"
        className="demo-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="demo-panel"
      >
        <span className="demo-icon">
          <FaInfo />
        </span>
        <span className="demo-title">
          <strong>Just want to look around?</strong>
          <small>Try the demo account</small>
        </span>
        <FaChevronDown className="demo-chevron" />
      </button>

      <div id="demo-panel" className="demo-panel" hidden={!open}>
        {row("username", "Username")}
        {row("password", "Password")}

        <button
          type="button"
          className="demo-fill"
          onClick={() => onFill(DEMO_ACCOUNT)}
        >
          <FaMagic /> Fill in the form for me
        </button>

        <ul className="demo-notes">
          <li><b>Can:</b> manage clients, transactions, currencies and view the login register.</li>
          <li><b>Cannot:</b> Manage users.</li>
        </ul>
      </div>
    </div>
  );
}
