import { useState, useEffect } from 'react';
import '../styles/loader.css';

export default function Loader({ onComplete }) {
  const [hidden, setHidden] = useState(false);
  const name = 'YASHAS M';

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
      setTimeout(() => onComplete?.(), 600);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`loader-wrapper ${hidden ? 'hidden' : ''}`}>
      <div className="loader-name">
        {name.split('').map((char, i) => (
          <span
            key={i}
            style={{ animationDelay: `${0.3 + i * 0.05}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
      <div className="loader-bar-track">
        <div className="loader-bar-fill" />
      </div>
    </div>
  );
}
