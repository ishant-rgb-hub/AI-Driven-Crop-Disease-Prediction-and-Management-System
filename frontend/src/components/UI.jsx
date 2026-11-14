import { AlertCircle, LoaderCircle, Sprout } from "lucide-react";

export function Spinner({ label = "Loading" }) {
  return (
    <span className="spinner-wrap" role="status">
      <LoaderCircle className="spinner" size={20} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function LoadingPage({ label = "Loading your Leafwise workspace" }) {
  return <main className="loading-page"><Spinner label={label} /><span>{label}</span></main>;
}

export function ErrorState({ title = "We couldn’t load this right now.", message, onRetry }) {
  return (
    <div className="notice notice-error" role="alert">
      <AlertCircle size={19} aria-hidden="true" />
      <div className="notice-copy">
        <strong>{title}</strong>
        {message && <span>{message}</span>}
      </div>
      {onRetry && <button className="text-button" type="button" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Sprout size={24} aria-hidden="true" /></span>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}

export function PageTitle({ eyebrow, title, description, actions }) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-title-actions">{actions}</div>}
    </div>
  );
}
