import React, { useEffect } from 'react';
import '../landing.css';

export default function LandingPage({ onEnterApp }) {
  useEffect(() => {
    // Scroll reveal logic
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* NAV */}
      <nav>
        <a className="nav-logo" href="#top">
          <div className="nav-logo-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z M12 6 L7 9 L7 15 L12 18 L17 15 L17 9 Z M12 10 L10 11.5 L10 14.5 L12 16 L14 14.5 L14 11.5 Z"/></svg>
          </div>
          Opportunity Radar
        </a>
        <div className="nav-links">
          <a href="#how">How It Works</a>
          <a href="#agents">Agents</a>
          <a href="#features">Features</a>
          <a href="#stack">Stack</a>
        </div>
        <button className="nav-cta" onClick={onEnterApp}>Launch Platform →</button>
      </nav>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero-grid-bg"></div>
        <div className="hero-blob hero-blob-1"></div>
        <div className="hero-blob hero-blob-2"></div>

        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          Live Intelligence · ET Gen AI Hackathon 2026
        </div>

        <h1>
          Market Alpha, Extracted<br/>
          by an <span className="accent-word">AI Swarm</span>
        </h1>

        <p className="hero-sub">
          5 autonomous agents monitor BSE/NSE filings, institutional deals, and earnings sentiment in real-time — surfacing only the signals that actually matter.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={onEnterApp}>
            Explore Platform
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a className="btn-secondary" href="#agents">
            Meet the Agents
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          </a>
        </div>

        <div className="ticker">
          <div className="ticker-item">
            <span className="ticker-val">5</span>
            <span className="ticker-label">AI Agents</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-val" style={{color: 'var(--success)'}}>9.2</span>
            <span className="ticker-label">Max Conviction</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-val">BSE + NSE</span>
            <span className="ticker-label">Data Sources</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-val">Real-Time</span>
            <span className="ticker-label">Signal Feed</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-val" style={{color: 'var(--accent)'}}>100%</span>
            <span className="ticker-label">Auditability</span>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <div className="preview-wrap reveal">
        <div className="preview-frame">
          <div className="preview-bar">
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
            <div className="preview-dot"></div>
            <div className="preview-url">opportunity-radar.app · Dashboard</div>
          </div>
          <div className="preview-body">
            <div className="preview-sidebar">
              <div className="preview-sidebar-logo">
                <div className="preview-sidebar-logo-icon">OR</div>
                Opp. Radar
              </div>
              <div className="preview-nav-item active"><div className="preview-nav-dot"></div> Dashboard</div>
              <div className="preview-nav-item"><div className="preview-nav-dot"></div> Live Signals</div>
              <div className="preview-nav-item"><div className="preview-nav-dot"></div> Watchlist</div>
              <div className="preview-nav-item"><div className="preview-nav-dot"></div> Backtest Lab</div>
            </div>
            <div className="preview-main">
              <div className="preview-row">
                <div className="preview-kpi">
                  <div className="preview-kpi-label">NIFTY 50</div>
                  <div className="preview-kpi-val up">24,628 ↑</div>
                </div>
                <div className="preview-kpi">
                  <div className="preview-kpi-label">SENSEX</div>
                  <div className="preview-kpi-val up">81,147 ↑</div>
                </div>
                <div className="preview-kpi">
                  <div className="preview-kpi-label">Active Signals</div>
                  <div className="preview-kpi-val">14</div>
                </div>
                <div className="preview-kpi">
                  <div className="preview-kpi-label">Avg Conviction</div>
                  <div className="preview-kpi-val" style={{color: 'var(--warning)'}}>7.4</div>
                </div>
              </div>
              <div className="preview-signals">
                <div className="preview-signal-row">
                  <div>
                    <div className="preview-signal-ticker">RELIANCE</div>
                    <div className="preview-signal-desc">Block deal: FII accumulation 4.2M shares</div>
                  </div>
                  <div style={{display: 'flex', gap: '7px', alignItems: 'center'}}>
                    <span className="badge bull">BULLISH</span>
                    <span className="score-badge high">9.1</span>
                  </div>
                </div>
                <div className="preview-signal-row">
                  <div>
                    <div className="preview-signal-ticker">HDFC BANK</div>
                    <div className="preview-signal-desc">PAT beat +18%; NIM expansion QoQ</div>
                  </div>
                  <div style={{display: 'flex', gap: '7px', alignItems: 'center'}}>
                    <span className="badge bull">BULLISH</span>
                    <span className="score-badge high">8.6</span>
                  </div>
                </div>
                <div className="preview-signal-row">
                  <div>
                    <div className="preview-signal-ticker">BAJAJFINSV</div>
                    <div className="preview-signal-desc">Management guidance cautious; AUM slowdown</div>
                  </div>
                  <div style={{display: 'flex', gap: '7px', alignItems: 'center'}}>
                    <span className="badge bear">BEARISH</span>
                    <span className="score-badge low">3.2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="section-label">Architecture</div>
        <div className="section-title reveal">From Raw Exchange Data<br/>to Actionable Intelligence</div>
        <p className="section-sub reveal">A hierarchical swarm processes thousands of daily filings through a four-stage cognitive pipeline — eliminating noise and scoring only what matters.</p>

        <div className="steps reveal">
          <div className="step">
            <div className="step-num">01</div>
            <div className="step-title">Ingest & Watch</div>
            <div className="step-desc">APScheduler polls BSE/NSE streams at high frequency. Raw JSON stored immutably in Supabase for full auditability.</div>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <div className="step-title">Specialist Analysis</div>
            <div className="step-desc">4 domain agents parse filings, bulk deals, earnings, and concall transcripts in parallel using Gemini 2.5 Flash.</div>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <div className="step-title">Conviction Scoring</div>
            <div className="step-desc">Sarvam-M 24B synthesizes all agent outputs into a single 0–10 conviction score and action suggestion.</div>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <div className="step-title">Routed Alerts</div>
            <div className="step-desc">Signals ≥7.0 trigger Email; ≥9.0 trigger WhatsApp — instantly surfacing only the highest-conviction intelligence.</div>
          </div>
        </div>
      </section>

      {/* AGENTS */}
      <section id="agents" style={{background: 'var(--bg)'}}>
        <div className="section-label">The Swarm</div>
        <div className="section-title reveal">5 Agents. One Unified<br/>Intelligence Layer.</div>
        <p className="section-sub reveal">Each agent is a specialist. Together, they form a reasoning system more reliable than any single model.</p>

        <div className="agents-grid reveal">
          <div className="agent-card">
            <div className="agent-icon">📄</div>
            <div className="agent-name">BSE Filing Analyst</div>
            <div className="agent-model">gemini-2.5-flash</div>
            <div className="agent-desc">Processes high-volume corporate announcements and separates routine administrative filings from material impactful disclosures.</div>
          </div>
          <div className="agent-card">
            <div className="agent-icon">🏦</div>
            <div className="agent-name">Institutional Deal Tracker</div>
            <div className="agent-model">gemini-2.5-flash</div>
            <div className="agent-desc">Monitors NSE Bulk & Block deal feeds to identify smart money accumulation patterns and distribution signals in real-time.</div>
          </div>
          <div className="agent-card">
            <div className="agent-icon">📊</div>
            <div className="agent-name">Results Analyzer</div>
            <div className="agent-model">screener.in + LLM</div>
            <div className="agent-desc">Parses quarterly earnings from Screener.in, surfacing PAT beats, margin expansions, and revenue surprises vs. estimates.</div>
          </div>
          <div className="agent-card">
            <div className="agent-icon">🎙️</div>
            <div className="agent-name">Sentiment Analyzer</div>
            <div className="agent-model">concall transcripts</div>
            <div className="agent-desc">Extracts forward-looking confidence metrics from management commentary, detecting hedged language and tonal shifts.</div>
          </div>
          <div className="agent-card" style={{gridColumn: 'span 1'}}>
            <div className="agent-icon">⚡</div>
            <div className="agent-name">Signal Conviction Scorer</div>
            <div className="agent-model">sarvam-m-24b</div>
            <div className="agent-desc">The final intelligence layer. Synthesizes all agent reasoning into a definitive conviction score (0–10) and determines the action suggestion with full auditability.</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{background: '#f1f5f9'}}>
        <div className="section-label">Platform</div>
        <div className="section-title reveal">Everything an Investor<br/>Needs to Stay Ahead</div>
        <p className="section-sub reveal">Four views built for the full workflow — from live discovery to historical validation.</p>

        <div className="features-grid reveal">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div>
              <div className="feature-title">Live Signals Radar</div>
              <div className="feature-desc">A comprehensive feed of all AI-generated alerts with dynamic filtering by sector, signal category, and semantic search — updated continuously as agents process new data.</div>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👁️</div>
            <div>
              <div className="feature-title">Intelligent Watchlist</div>
              <div className="feature-desc">Track specific stocks with AI sentiment dynamically mapped from the latest intelligence signals. See Bullish, Bearish, and Neutral status at a glance.</div>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔬</div>
            <div>
              <div className="feature-title">Backtest Lab</div>
              <div className="feature-desc">Validate signal precision by replaying the proprietary SMA 20/50 Golden Cross algorithm against historical price action to simulate win rates and equity curves.</div>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <div>
              <div className="feature-title">Multi-Channel Alerts</div>
              <div className="feature-desc">Email via Resend for conviction ≥ 7.0. WhatsApp via Twilio for extreme signals ≥ 9.0. Both channels deliver identical, structured alert templates for consistency.</div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="tech" id="stack">
        <div className="section-label">Infrastructure</div>
        <div className="section-title reveal">Production-Grade Stack,<br/>Built for Scale</div>
        <p className="section-sub reveal">Every component chosen for reliability, auditability, and real-time performance on Indian market data.</p>
        <div className="tech-pills reveal">
          <div className="tech-pill"><div className="tech-pill-dot"></div>Sarvam-M 24B</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>Gemini 2.5 Flash</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>CrewAI</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>FastAPI + Uvicorn</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>APScheduler</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>Supabase PostgreSQL</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>React + Vite</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>Recharts</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>Framer Motion</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>yfinance</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>Twilio WhatsApp</div>
          <div className="tech-pill"><div className="tech-pill-dot"></div>Resend Email</div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="section-label" style={{color: 'rgba(232,119,34,0.9)'}}>Get Started</div>
        <div className="section-title">Stop Scanning Filings.<br/>Start Acting on Intelligence.</div>
        <p className="section-sub">Opportunity Radar runs 24/7, filtering the noise so you only see signals worth acting on.</p>
        <button className="btn-primary" onClick={onEnterApp}>
          Launch the Platform
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <div className="footer-logo-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2 L22 7 L22 17 L12 22 L2 17 L2 7 Z M12 6 L7 9 L7 15 L12 18 L17 15 L17 9 Z M12 10 L10 11.5 L10 14.5 L12 16 L14 14.5 L14 11.5 Z"/></svg>
          </div>
          Opportunity Radar
        </div>
        <div className="footer-copy">© 2026 Opportunity Radar. ET Gen AI Hackathon.</div>
        <div className="footer-tag">POWERED BY SARVAM + GEMINI + CREWAI</div>
      </footer>
    </div>
  );
}
