import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Brand from "./Brand.jsx";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Brand light />
        <button
          type="button"
          className="icon-button mobile-menu-button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`site-nav${menuOpen ? " site-nav-open" : ""}`} aria-label="Main navigation">
          <a href="#features" onClick={closeMenu}>Features</a>
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <a href="#crops" onClick={closeMenu}>For your crops</a>
          {user ? (
            <div className="nav-auth">
              <Link className="nav-dashboard" to="/dashboard" onClick={closeMenu}>My dashboard <ArrowUpRight size={15} /></Link>
              <button className="nav-logout" type="button" onClick={() => { logout(); closeMenu(); }}>Sign out</button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link className="nav-login" to="/login" onClick={closeMenu}>Log in</Link>
              <Link className="button button-light button-small" to="/register" onClick={closeMenu}>Get started <ArrowUpRight size={15} /></Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
