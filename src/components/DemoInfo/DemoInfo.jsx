import { useEffect, useRef, useState } from "react";
import { FaInfo, FaChevronDown, FaCopy, FaCheck, FaUser, FaLock } from "react-icons/fa";
import { DEMO_ACCOUNT } from "../../config/demoAccount";
import "./DemoInfo.css";

// A small note above the login form: an animated info icon that opens the demo credentials.
// onFill({ username, password }) fills the login form with them.
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

  const use = () => {
    onFill(DEMO_ACCOUNT);
    setOpen(false);
  };

  // One credential: an icon instead of a word, the value, and a copy button
  const row = (key, icon, name) => (
    <div className="demo-row">
      <span className="demo-row-icon">{icon}</span>
      <code className="demo-value">{DEMO_ACCOUNT[key]}</code>
      <button
        type="button"
        className={copied === key ? "demo-copy done" : "demo-copy"}
        onClick={() => copy(key)}
        aria-label={`Copy ${name}`}
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
        <strong className="demo-title">Try the demo</strong>
        <FaChevronDown className="demo-chevron" />
      </button>

      <div id="demo-panel" className="demo-panel" hidden={!open}>
        {row("username", <FaUser />, "username")}
        {row("password", <FaLock />, "password")}

        <button type="button" className="demo-fill" onClick={use}>
          Use demo account
        </button>
      </div>
    </div>
  );
}
