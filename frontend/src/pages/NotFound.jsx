import { ArrowLeft, CircleHelp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  return (
    <main className="not-found-page">
      <span className="not-found-icon"><CircleHelp size={25} /></span>
      <span className="eyebrow">Page not found</span>
      <h1>This path isn’t available here.</h1>
      <p><code>{location.pathname}</code> isn’t part of the current frontend. AI detection, disease library, history, and analytics pages are maintained by a separate project module.</p>
      <Link to="/" className="button button-primary"><ArrowLeft size={16} /> Back to Leafwise</Link>
    </main>
  );
}
