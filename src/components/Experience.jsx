import { useEffect, useRef } from 'react';
import '../styles/experience.css';

const experiences = [
  {
    role: 'SDE & Full Stack Developer',
    type: 'Learning & Building',
    date: 'NOW',
    description: 'Grinding DSA and sharpening full-stack skills through real projects. On the path to cracking SDE roles.',
  },
  {
    role: 'AI Annotator & Evaluator',
    type: 'Freelance',
    date: '2026',
    description: 'Evaluating and annotating AI/ML datasets across Outlier, Mercor, RWS TrainAI and DataAnnotation.tech. Gaining deep insight into LLM behaviour and model quality.',
  },
  {
    role: 'AI & ML Engineer',
    type: 'Learning & Building',
    date: '2025',
    description: 'Exploring LLMs, multi-agent systems and RAG. Building AI-powered projects and evaluating models across annotation platforms.',
  },
  {
    role: 'The SDE Journey Begins',
    type: 'Self-Taught & Projects',
    date: '2024',
    description: 'Learned Java, DSA and Python from scratch. Completed virtual internships with JP Morgan Chase and Quantium via Forage.',
  },
  {
    role: 'Graphic Designer',
    type: 'Freelance',
    date: '2022',
    description: 'Created logos, banners and visual content for clients. This creative side later influenced my approach to UI and product design.',
  },
  {
    role: 'Begin Learning',
    type: 'Foundation',
    date: '2021',
    description: 'Started my tech journey from zero — computers, basic tools, and curiosity that led to everything after.',
  }
];

export default function Experience() {
  const lineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!lineRef.current) return;
      const rect = lineRef.current.parentElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled into the section
      let progress = (windowHeight - rect.top) / rect.height;
      progress = Math.max(0, Math.min(1, progress));
      
      // Update the height of the glowing line
      lineRef.current.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="section experience" id="experience">
      <div className="container">
        
        <div className="exp-header">
          <h2 className="exp-title">
            My career &<br />
            <span className="exp-title-highlight">experience</span>
          </h2>
        </div>

        <div className="exp-timeline-container">
          {/* Base transparent line */}
          <div className="exp-line-bg"></div>
          {/* Glowing animated line */}
          <div className="exp-line-glow" ref={lineRef}></div>

          {experiences.map((exp, index) => (
            <div className="exp-row" key={index}>
              {/* Left Side: Role and Type */}
              <div className="exp-left">
                <h3 className="exp-role">{exp.role}</h3>
                <p className="exp-type">{exp.type}</p>
              </div>

              {/* Middle: Date and Dot */}
              <div className="exp-middle">
                <span className="exp-date">{exp.date}</span>
                <div className="exp-dot"></div>
              </div>

              {/* Right Side: Description */}
              <div className="exp-right">
                <p className="exp-desc">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
