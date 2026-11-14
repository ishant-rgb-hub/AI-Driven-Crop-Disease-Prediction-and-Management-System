import { useCallback, useEffect, useState } from "react";
import {
  Activity, ArrowRight, CalendarDays, CircleAlert, Clock3, Leaf, MapPin,
  ScanLine, Sprout, Stethoscope, TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client.js";
import { ErrorState, EmptyState, PageTitle, Spinner } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const metrics = [
  { title: "Total scans", value: "Not available", note: "Prediction history API not connected", icon: ScanLine },
  { title: "Healthy crops", value: "Not available", note: "Requires prediction results", icon: Leaf },
  { title: "Diseased crops", value: "Not available", note: "Requires prediction results", icon: Stethoscope },
  { title: "Recent activity", value: "Not available", note: "Requires prediction history", icon: Activity },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [farmData, setFarmData] = useState({ farms: [], crops: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const firstName = user?.name?.trim().split(/\s+/)[0] || "there";

  const loadFarmData = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest("/farms", { signal });
      const farms = response.farms || [];
      const cropResponses = await Promise.all(
        farms.map((farm) => apiRequest(`/farms/${farm.id}/crops`, { signal })),
      );
      const crops = cropResponses.flatMap((result) => result.crops || []);
      setFarmData({ farms, crops });
    } catch (requestError) {
      if (requestError.name !== "AbortError") setError(requestError.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadFarmData(controller.signal);
    return () => controller.abort();
  }, [loadFarmData]);

  const cropNames = [...new Set(farmData.crops.map((crop) => crop.cropName).filter(Boolean))];

  return (
    <div className="dashboard-page">
      <PageTitle eyebrow="YOUR FARM AT A GLANCE" title={`Good morning, ${firstName}.`} description="Here’s a little overview of your Leafwise workspace." />
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="welcome-tag"><Sprout size={15} /> A new day in the field</span>
          <h2>Let’s grow something <em>good.</em></h2>
          <p>Your farm details and crop information, all in one place. Start with what’s growing today.</p>
          <Link className="button button-light button-small" to="/profile">Review your profile <ArrowRight size={15} /></Link>
        </div>
        <span className="welcome-art" aria-hidden="true"><Leaf size={130} strokeWidth={0.8} /></span>
      </section>

      <div className="section-heading-row">
        <div><span className="eyebrow">A season in view</span><h2>Your overview</h2></div>
        <span className="updated-note"><CalendarDays size={15} /> Live from your account</span>
      </div>

      <div className="stats-grid">
        {metrics.map(({ title, value, note, icon: Icon }) => (
          <article className="stat-card stat-card-muted" key={title}>
            <div className="stat-card-top"><span className="stat-icon"><Icon size={19} /></span><span className="stat-status"><CircleAlert size={13} /> API unavailable</span></div>
            <span className="stat-title">{title}</span><strong className="stat-value stat-value-muted">{value}</strong><span className="stat-note">{note}</span>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel farm-panel">
          <div className="panel-heading"><div><span className="eyebrow">Your land</span><h2>Farm & crop overview</h2></div><span className="panel-icon"><Sprout size={18} /></span></div>
          {loading ? <div className="panel-loading"><Spinner label="Loading farm information" /><span>Loading your farm information…</span></div>
            : error ? <ErrorState title="Farm information couldn’t be loaded." message={error} onRetry={() => loadFarmData()} />
              : farmData.farms.length === 0 ? (
                <EmptyState title="Your farm story starts here." message="When your farm details are connected, your farm and crop overview will appear here." action={<span className="quiet-note">Farm creation is not available in this frontend yet.</span>} />
              ) : (
                <>
                  <div className="farm-summary">
                    <div className="farm-summary-item"><span className="farm-summary-icon"><MapPin size={17} /></span><span><strong>{farmData.farms.length}</strong><small>{farmData.farms.length === 1 ? "Farm" : "Farms"} in your account</small></span></div>
                    <div className="farm-summary-item"><span className="farm-summary-icon"><Leaf size={17} /></span><span><strong>{farmData.crops.length}</strong><small>{farmData.crops.length === 1 ? "Crop" : "Crops"} registered</small></span></div>
                  </div>
                  <div className="farm-list">
                    {farmData.farms.map((farm) => {
                      const count = farmData.crops.filter((crop) => crop.farmId === farm.id).length;
                      return <article className="farm-row" key={farm.id}><div className="farm-avatar"><Sprout size={19} /></div><div className="farm-row-info"><strong>{farm.farmName}</strong><span><MapPin size={13} />{farm.location}</span></div><span className="farm-crop-count">{count} {count === 1 ? "crop" : "crops"}</span></article>;
                    })}
                  </div>
                  {cropNames.length > 0 && <div className="crop-name-list"><span>Registered crops</span><div>{cropNames.map((name) => <span className="crop-pill" key={name}>{name}</span>)}</div></div>}
                </>
              )}
        </section>
        <section className="panel health-panel">
          <div className="panel-heading"><div><span className="eyebrow">Crop health</span><h2>Health snapshot</h2></div><span className="panel-icon"><TrendingUp size={18} /></span></div>
          <div className="health-unavailable"><span className="health-icon"><Activity size={21} /></span><h3>Health insights will show here</h3><p>Crop health trends depend on prediction results, and that API isn’t available in this branch yet.</p><span className="data-source-note">No health status has been inferred or estimated.</span></div>
        </section>
      </div>

      <div className="dashboard-grid dashboard-grid-bottom">
        <section className="panel activity-panel">
          <div className="panel-heading"><div><span className="eyebrow">Keep track</span><h2>Recent activity</h2></div><Clock3 size={18} className="panel-subtle-icon" /></div>
          <EmptyState title="No prediction activity to show." message="Your prediction history will appear here once a history endpoint is available." />
        </section>
        <section className="panel quick-panel">
          <div className="panel-heading"><div><span className="eyebrow">Make it yours</span><h2>Quick actions</h2></div><ScanLine size={18} className="panel-subtle-icon" /></div>
          <div className="quick-actions">
            <Link className="quick-action" to="/scan"><span className="quick-action-icon"><ScanLine size={18} /></span><span><strong>Scan a crop</strong><small>Open crop detection</small></span><ArrowRight size={16} /></Link>
            <Link className="quick-action" to="/diseases"><span className="quick-action-icon quick-action-icon-leaf"><Leaf size={18} /></span><span><strong>Disease library</strong><small>Explore crop conditions</small></span><ArrowRight size={16} /></Link>
            <Link className="quick-action" to="/history"><span className="quick-action-icon quick-action-icon-blue"><Clock3 size={18} /></span><span><strong>View history</strong><small>See your past predictions</small></span><ArrowRight size={16} /></Link>
            <Link className="quick-action" to="/analytics"><span className="quick-action-icon quick-action-icon-gold"><TrendingUp size={18} /></span><span><strong>View analytics</strong><small>Understand your crop trends</small></span><ArrowRight size={16} /></Link>
          </div>
        </section>
      </div>
      <div className="dashboard-disclaimer"><CircleAlert size={16} /><span>Prediction history, scan counts, and crop health analytics are not exposed by the current backend API. These figures are intentionally not estimated.</span></div>
    </div>
  );
}
