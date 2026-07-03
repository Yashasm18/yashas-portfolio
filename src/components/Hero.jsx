import { useState, useEffect } from 'react';
import '../styles/hero.css';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero" id="home">
      {/* Left side text (IN FRONT of avatar) */}
      <div 
        className="hero-left"
        style={{ transform: `translate(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)` }}
      >
        <p className="hero-greeting">Hello! I'm</p>
        <h1 className="hero-title">
          YASHAS<br />
          M
        </h1>
      </div>

      {/* Right side text (BEHIND avatar) */}
      <div 
        className="hero-right"
        style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
      >
        <p className="hero-an">An</p>
        <h2 className="hero-role-outline">AI ENGINEER</h2>
        <h2 className="hero-role-solid">FULL-STACK DEV</h2>
      </div>
      
      {/* Scroll indicator */}
      <div className="resume-indicator">
        <span>R E S U M E</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      </div>
    </section>
  );
}
