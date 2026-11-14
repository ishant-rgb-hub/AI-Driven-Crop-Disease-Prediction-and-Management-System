import { useState } from "react";
import {
  Activity, ChevronDown, CircleUserRound, Clock3, LayoutDashboard, Leaf,
  LogOut, Menu, ScanLine, Sprout, X,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import Brand from "./Brand.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const workspaceLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/scan", label: "Scan a crop", icon: ScanLine },
  { to: "/diseases", label: "Disease library", icon: Leaf },
  { to: "/history", label: "Prediction history", icon: Clock3 },
  { to: "/analytics", label: "Crop analytics", icon: Activity },
];

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Farmer";

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="workspace">
      {drawerOpen && <button className="drawer-backdrop" type="button" aria-label="Close navigation" onClick={closeDrawer} />}
      <aside className={`sidebar${drawerOpen ? " sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button type="button" className="icon-button sidebar-close" aria-label="Close navigation" onClick={closeDrawer}><X size={20} /></button>
        </div>
        <div className="sidebar-section-label">Workspace</div>
        <nav className="sidebar-nav" aria-label="Workspace navigation">
          {workspaceLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `sidebar-link${isActive ? " sidebar-link-active" : ""}`} onClick={closeDrawer}>
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span>
              {label === "Scan a crop" && <span className="sidebar-new">AI</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon"><Sprout size={18} /></span>
            <strong>Good farming starts with good information.</strong>
            <span>Keep learning about your crops, one step at a time.</span>
          </div>
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? " sidebar-link-active" : ""}`} onClick={closeDrawer}>
            <CircleUserRound size={18} strokeWidth={1.8} aria-hidden="true" /><span>My profile</span>
          </NavLink>
          <button className="sidebar-link sidebar-signout" type="button" onClick={logout}>
            <LogOut size={18} strokeWidth={1.8} aria-hidden="true" /><span>Sign out</span>
          </button>
        </div>
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <button type="button" className="icon-button workspace-menu" aria-label="Open navigation" onClick={() => setDrawerOpen(true)}><Menu size={21} /></button>
          <div className="topbar-context"><span>LEAFWISE WORKSPACE</span><ChevronDown size={14} aria-hidden="true" /></div>
          <NavLink to="/profile" className="topbar-user">
            <span className="avatar">{firstName.slice(0, 1).toUpperCase()}</span>
            <span className="topbar-user-name">{firstName}</span>
          </NavLink>
        </header>
        <main className="workspace-content"><Outlet /></main>
      </div>
    </div>
  );
}
