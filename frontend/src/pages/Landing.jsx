import {
  ArrowDown, ArrowRight, ArrowUpRight, Bug, Check, ChevronRight, CircleCheck,
  ClipboardList, Leaf, ScanLine, ShieldCheck, Sprout, Sun, TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

const features = [
  { icon: ScanLine, number: "01", title: "AI disease detection", text: "Get a clearer first look at crop leaf concerns with AI-assisted image analysis." },
  { icon: Sun, number: "02", title: "Instant crop analysis", text: "Turn a photo into useful context, so you can make your next decision with care." },
  { icon: ClipboardList, number: "03", title: "A growing disease library", text: "Explore crop disease information and practical steps to help protect your plants." },
  { icon: Sprout, number: "04", title: "Smart recommendations", text: "Find relevant treatment and prevention guidance alongside your crop insights." },
  { icon: TrendingUp, number: "05", title: "Crop health monitoring", text: "Keep your farm details together and follow crop health as your season grows." },
];

const steps = [
  { number: "01", title: "Take a clear photo", text: "Choose a leaf that shows the concern. Good light and a focused image help." },
  { number: "02", title: "Review your insight", text: "Get an AI-assisted result designed to help you understand what to look for." },
  { number: "03", title: "Choose your next step", text: "Explore relevant information and decide how to care for your crop." },
];

export default function Landing() {
  return (
    <>
      <div id="top" />
      <Navbar />
      <main>
        <section className="hero">
          <div className="hero-image" role="img" aria-label="Sunrise over rows of healthy crops" />
          <div className="hero-overlay" />
          <div className="hero-content page-container">
            <div className="hero-copy">
              <span className="hero-kicker"><span className="kicker-dot" /> A little more confidence in every growing season</span>
              <h1>Healthy Crops.<br />Smarter Farming.<br /><em>Better Harvests.</em></h1>
              <p>Understand what your crops are telling you. Leafwise brings AI-powered disease insights and practical guidance a little closer to the field.</p>
              <div className="hero-actions">
                <Link to="/register" className="button button-light">Get started <ArrowUpRight size={17} /></Link>
                <a href="#features" className="hero-text-link">Explore features <ArrowDown size={16} /></a>
              </div>
              <div className="hero-trust"><span className="trust-leaves"><Leaf size={15} /><Leaf size={15} /><Leaf size={15} /></span><span>Thoughtful tools for everyday farming</span></div>
            </div>
            <div className="hero-note">
              <span className="hero-note-icon"><Sprout size={19} /></span>
              <div><strong>From the field to a clearer next step</strong><span>Crop care, made easier to understand.</span></div>
            </div>
          </div>
          <a className="hero-scroll" href="#intro" aria-label="Scroll to learn more"><span>Scroll to explore</span><ChevronRight size={15} /></a>
        </section>

        <section className="intro-section section-pad" id="intro">
          <div className="page-container intro-grid">
            <div className="intro-label"><span className="eyebrow">A healthier way forward</span><span className="intro-line" /></div>
            <div className="intro-copy">
              <h2>When your crops thrive,<br /><em>your hard work shows.</em></h2>
              <p>Spotting a problem early can make all the difference. Leafwise helps you understand crop health with approachable AI insights—so you can spend less time guessing and more time growing.</p>
              <a className="arrow-link" href="#how-it-works">See how it works <ArrowRight size={16} /></a>
            </div>
            <div className="intro-image-wrap">
              <img src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1100&q=85" alt="Golden light over a lush green farm" />
              <div className="image-caption"><span><Leaf size={17} /></span><div><strong>Made for the growing season</strong><small>Support for your day-to-day crop care</small></div></div>
            </div>
          </div>
        </section>

        <section className="features-section section-pad" id="features">
          <div className="page-container">
            <div className="section-heading">
              <span className="eyebrow">The Leafwise toolkit</span>
              <h2>Small insights.<br /><em>Meaningful progress.</em></h2>
              <p>Practical tools to help you understand your crops and make informed decisions through the season.</p>
            </div>
            <div className="features-grid">
              {features.map(({ icon: Icon, number, title, text }) => (
                <article className="feature-card" key={title}>
                  <div className="feature-top"><span className="feature-icon"><Icon size={21} strokeWidth={1.8} /></span><span className="feature-number">{number}</span></div>
                  <h3>{title}</h3><p>{text}</p>
                  <span className="feature-card-rule" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="process-section section-pad" id="how-it-works">
          <div className="page-container process-grid">
            <div className="process-intro">
              <span className="eyebrow eyebrow-light">Simple by design</span>
              <h2>From leaf<br />to <em>next step.</em></h2>
              <p>Good crop care starts with noticing. Leafwise helps you move from a question to useful information—without making the process complicated.</p>
              <Link to="/register" className="button button-outline-light">Get started <ArrowUpRight size={16} /></Link>
            </div>
            <div className="process-steps">
              {steps.map((step, index) => (
                <article className="process-step" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                  {index < steps.length - 1 && <span className="step-connector" />}
                </article>
              ))}
            </div>
            <div className="process-decoration" aria-hidden="true"><Leaf size={110} strokeWidth={0.65} /></div>
          </div>
        </section>

        <section className="crops-section section-pad" id="crops">
          <div className="page-container crops-grid">
            <div className="crops-copy">
              <span className="eyebrow">Growing together</span>
              <h2>Built around the<br /><em>crops you care for.</em></h2>
              <p>Leafwise is starting with two familiar crops and growing its support over time. Explore crop health information that helps you take your next step.</p>
              <div className="crop-tags"><span><Check size={15} /> Tomato</span><span><Check size={15} /> Potato</span></div>
            </div>
            <div className="crop-photo-grid">
              <figure className="crop-photo crop-photo-tomato"><img src="https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85" alt="Fresh tomatoes growing on the vine" /><figcaption><span>01</span> Tomato <ArrowUpRight size={15} /></figcaption></figure>
              <figure className="crop-photo crop-photo-potato"><img src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85" alt="Freshly harvested potatoes" /><figcaption><span>02</span> Potato <ArrowUpRight size={15} /></figcaption></figure>
            </div>
          </div>
        </section>

        <section className="benefits-section section-pad" id="benefits">
          <div className="page-container benefits-grid">
            <div className="benefits-visual">
              <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85" alt="Wide green fields under a calm morning sky" />
              <div className="benefits-badge"><ShieldCheck size={20} /><span>Know more.<br /><strong>Grow with care.</strong></span></div>
            </div>
            <div className="benefits-copy" id="about">
              <span className="eyebrow">Why Leafwise</span>
              <h2>Technology that<br /><em>respects the field.</em></h2>
              <p>Tools should make farm work clearer, not more complicated. Leafwise brings crop information into one welcoming place—with your decisions always in your hands.</p>
              <ul>
                <li><CircleCheck size={19} /><span><strong>Understandable insights</strong><small>Clear language, with useful details close by.</small></span></li>
                <li><CircleCheck size={19} /><span><strong>Information in one place</strong><small>Keep your account and farm details together.</small></span></li>
                <li><CircleCheck size={19} /><span><strong>Support for informed decisions</strong><small>Practical guidance to help you consider what comes next.</small></span></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="closing-section">
          <div className="page-container closing-inner">
            <div className="closing-mark"><Bug size={21} /></div>
            <span className="eyebrow eyebrow-light">Your next growing season starts here</span>
            <h2>Grow with a little<br /><em>more confidence.</em></h2>
            <p>Create your Leafwise account and make room for a clearer view of your crops.</p>
            <Link to="/register" className="button button-light">Get started with Leafwise <ArrowUpRight size={17} /></Link>
          </div>
          <span className="closing-decoration closing-decoration-one" aria-hidden="true"><Leaf size={150} /></span>
          <span className="closing-decoration closing-decoration-two" aria-hidden="true"><Leaf size={105} /></span>
        </section>
      </main>
      <Footer />
    </>
  );
}
