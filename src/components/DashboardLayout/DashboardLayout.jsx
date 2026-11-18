import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import BottomNav from "../BottomNav/BottomNav";
import "./DashboardLayout.css";

const WIDE = "(min-width: 960px)";

// The wide-screen choice (menu shown or hidden) is remembered in the browser
function readCollapsed() {
  try {
    return localStorage.getItem("sidebarCollapsed") === "1";
  } catch {
    return false; // storage can be blocked
  }
}

export default function DashboardLayout() {
  // Phones: the full menu is a drawer.  Wide screens: the menu can be folded away.
  const [navOpen, setNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      try {
        localStorage.setItem("sidebarCollapsed", current ? "0" : "1");
      } catch {
        // not remembered, but it still works for this visit
      }
      return !current;
    });
  };

  // One button for every screen: on wide screens it folds the menu, on phones it opens the drawer
  const handleMenu = () => {
    if (window.matchMedia(WIDE).matches) toggleCollapsed();
    else setNavOpen(true);
  };

  // While the drawer is open: lock page scroll and let Escape close it
  useEffect(() => {
    if (!navOpen) return;

    const onKey = (e) => e.key === "Escape" && setNavOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

  return (
    <div className={collapsed ? "layout nav-collapsed" : "layout"}>
      <Sidebar
        open={navOpen}
        onClose={() => setNavOpen(false)}
        collapsed={collapsed}
        onExpand={() => collapsed && toggleCollapsed()}
      />

      <div className="layout-main">
        <Header onMenu={handleMenu} collapsed={collapsed} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>

      <BottomNav onMore={() => setNavOpen(true)} />
    </div>
  );
}
