import { useState, useEffect, useRef } from 'react';
import GitHubCalendar from 'react-github-calendar';
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
            <div className="github-stats-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', margin: '1.5rem 0' }}>
              <img 
                src="https://github-stats-extended-henna.vercel.app/api?username=Yashasm18&include_all_commits=true&count_private=true&show_icons=true&hide_border=true&title_color=199CFF&text_color=a3a3a3&icon_color=199CFF&bg_color=00000000&v=6" 
                alt="GitHub Stats" 
                style={{ width: '100%', maxWidth: '450px' }}
              />
              <img 
                src="https://github-readme-streak-stats.herokuapp.com/?user=Yashasm18&theme=transparent&hide_border=true&stroke=0000&ring=199CFF&fire=199CFF&currStreakNum=199CFF&sideNums=199CFF&currStreakLabel=a3a3a3&sideLabels=a3a3a3&dates=a3a3a3&v=6" 
                alt="GitHub Streak" 
                style={{ width: '100%', maxWidth: '450px' }}
              />
            </div>
            <div className="github-graph-placeholder" style={{ padding: '1rem', overflow: 'hidden', display: 'flex', justifyContent: 'center', width: '100%' }}>
              <GitHubCalendar 
                username="Yashasm18" 
                colorScheme="dark"
                blockSize={12}
                blockMargin={4}
                fontSize={12}
                theme={{
                  dark: ['#161b22', '#d946ef', '#c026d3', '#a21caf', '#86198f'],
                }}
              />
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
