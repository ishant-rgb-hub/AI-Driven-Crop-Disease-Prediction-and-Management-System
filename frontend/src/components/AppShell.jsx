import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  ["Dashboard", "/app"],
  ["Detect disease", "/app/detect"],
  ["Disease library", "/app/diseases"],
  ["Prediction history", "/app/history"],
  ["Profile", "/app/profile"],
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/app" className="brand"><span className="brand-mark">✦</span> leafwise</NavLink>
        <p className="eyebrow sidebar-label">Workspace</p>
        <nav>{links.map(([label, path]) => <NavLink key={path} to={path} end={path === "/app"} className="side-link"><span>{label === "Dashboard" ? "⌂" : label === "Detect disease" ? "⌁" : label === "Disease library" ? "◈" : label === "Prediction history" ? "◷" : "○"}</span>{label}</NavLink>)}</nav>
        <div className="sidebar-bottom">
          <div className="user-mini"><span className="avatar">{user?.name?.slice(0, 1).toUpperCase()}</span><div><strong>{user?.name}</strong><small>{user?.email}</small></div></div>
          <button className="logout-button" onClick={() => { logout(); navigate("/"); }}>Log out</button>
        </div>
      </aside>
      <main className="main-content"><Outlet /></main>
    </div>
  );
}
