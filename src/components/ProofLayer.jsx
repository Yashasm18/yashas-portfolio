import { useState, useEffect, useRef } from 'react';
import '../styles/proof.css';

const certs = [
  {
    name: 'AI Agents Intensive',
    issuer: 'Kaggle',
    icon: '🏅'
  },
  {
    name: 'ML Summer School (Test Attempt)',
    issuer: 'Amazon',
    icon: '🎓'
  },
  {
    name: 'Solutions Challenge',
    issuer: 'Google',
    icon: '🌍'
  },
  {
    name: 'Meta × PyTorch Top 50',
    issuer: 'Meta',
    icon: '🔥'
  }
];

export default function ProofLayer() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section proof" ref={sectionRef}>
      <div className="container">
        
        <div className="proof-grid">
          
          <div className={`proof-resume reveal ${visible ? 'visible' : ''} reveal-delay-1`}>
            <span className="proof-resume-text">Looking for the full picture?</span>
            <a href="#" className="proof-resume-btn" onClick={(e) => { e.preventDefault(); alert('Link your resume PDF here!'); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Resume
            </a>
          </div>

          <div className={`proof-github-card reveal ${visible ? 'visible' : ''} reveal-delay-2`}>
            <h3 className="proof-github-title">GitHub Contributions</h3>
            <p className="proof-github-subtitle">Consistent open-source activity</p>
            <div className="github-graph-placeholder">
              <div className="github-mini-graph">
                {/* Generating random activity boxes for the placeholder */}
                {Array.from({ length: 154 }).map((_, i) => (
                  <div key={i} className={`github-cell l${Math.floor(Math.random() * 5)}`} />
                ))}
              </div>
              {/* Note: In a real app, you might use a library like react-github-calendar here */}
            </div>
          </div>
          
        </div>

        <div className={`proof-certs reveal ${visible ? 'visible' : ''} reveal-delay-3`}>
          <h3 className="proof-certs-title">Certifications & Hackathons</h3>
          <div className="proof-certs-grid">
            {certs.map((cert, idx) => (
              <div key={idx} className="cert-card">
                <div className="cert-icon">{cert.icon}</div>
                <div className="cert-info">
                  <div className="cert-name">{cert.name}</div>
                  <div className="cert-issuer">{cert.issuer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
