import { ArrowUpRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="brand brand-light" to="/">
            <span className="brand-mark"><Leaf size={21} aria-hidden="true" /></span><span>leafwise</span>
          </Link>
          <p>Clearer crop insights for the people who grow our food.</p>
        </div>
        <div className="footer-links">
          <div><span className="footer-heading">Explore</span><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#crops">Supported crops</a></div>
          <div><span className="footer-heading">Your account</span><Link to="/login">Log in</Link><Link to="/register">Create account</Link><Link to="/dashboard">Dashboard</Link></div>
          <div><span className="footer-heading">About Leafwise</span><a href="#about">Our approach</a><a href="#benefits">For farmers</a></div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Leafwise. Built for healthier harvests.</span>
        <a href="#top">Back to top <ArrowUpRight size={14} /></a>
      </div>
    </footer>
  );
}
