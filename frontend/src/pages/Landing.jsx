import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return <div className="landing">
    <header className="public-nav"><Link to="/" className="brand"><span className="brand-mark">✦</span> leafwise</Link><nav><a href="#how">How it works</a><a href="#about">About</a><Link to="/login">Log in</Link><Link className="button dark small" to="/register">Get started</Link></nav></header>
    <section className="hero"><div className="hero-copy"><p className="eyebrow">Plant health, made clear</p><h1>Catch crop disease <em>before</em> it spreads.</h1><p className="hero-text">Upload a leaf photo and get a clear, actionable health insight in seconds. Built for growers who want to protect every harvest.</p><div className="hero-actions"><Link className="button primary" to="/register">Start a diagnosis <span>↗</span></Link><a className="text-link" href="#how">See how it works ↓</a></div><div className="trust-row"><span>✦</span><p>Designed for tomato & potato growers<br /><strong>10 disease classes supported</strong></p></div></div><div className="hero-visual"><div className="leaf-card"><div className="leaf-art">⌁</div><div className="scan-line" /><div className="result-chip"><span className="dot" /> AI-ready crop insights</div></div><div className="floating-note note-top"><span>✦</span><div><strong>Early detection</strong><small>Protect your yield</small></div></div><div className="floating-note note-bottom"><span className="confidence">94%</span><div><strong>Confidence score</strong><small>Clearer decisions</small></div></div></div></section>
    <section className="feature-strip" id="how"><div><span>01</span><h3>Capture</h3><p>Take a clear photo of the leaf.</p></div><div><span>02</span><h3>Analyze</h3><p>Our prediction service checks visible signs.</p></div><div><span>03</span><h3>Act</h3><p>Understand the result and plan next steps.</p></div></section>
    <section className="landing-bottom" id="about"><p className="eyebrow">A healthier harvest starts here</p><h2>Simple tools for better crop decisions.</h2><Link className="button outline" to="/register">Explore leafwise <span>↗</span></Link></section>
    <footer><span>✦ leafwise</span><small>Crop intelligence for every grower.</small></footer>
  </div>;
}
