import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Brand({ light = false, compact = false }) {
  return (
    <Link className={`brand${light ? " brand-light" : ""}${compact ? " brand-compact" : ""}`} to="/" aria-label="Leafwise home">
      <span className="brand-mark"><Leaf size={21} strokeWidth={2.2} aria-hidden="true" /></span>
      <span>leafwise</span>
    </Link>
  );
}
