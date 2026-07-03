import { useEffect, useRef } from 'react';
import '../styles/experience.css';

const experiences = [
  {
    role: 'Learning Something New',
    type: 'Self-Development',
    date: 'NOW',
    description: 'Continuously exploring emerging technologies, researching advanced AI systems, and pushing the boundaries of what\'s possible in tech.',
  },
  {
    role: 'AI Engineer',
    type: 'Freelance & Projects',
    date: '2025',
    description: 'Developing intelligent AI systems, chatbots, and machine learning solutions. Building next-gen conversational AI agents and JARVIS-like personal assistants.',
  },
  {
    role: 'Full-Stack Developer',
    type: 'Freelance & Projects',
    date: '2024',
    description: 'Built complete web applications from frontend to backend. Developed responsive UIs, RESTful APIs, and database solutions for various clients and projects.',
  },
  {
    role: 'Python Developer',
    type: 'Self-Taught & Projects',
    date: '2023',
    description: 'Dove deep into Python programming, building automation scripts, bots, and mastering the fundamentals of software development and problem-solving.',
  },
  {
    role: 'Graphic Designer',
    type: 'Freelance',
    date: '2022',
    description: 'Started my creative journey as a graphic designer, creating logos, banners, and visual content. This sparked my passion for technology and digital creation.',
  },
  {
    role: 'Microsoft Office',
    type: 'Begin Learning',
    date: '2021',
    description: 'Started my journey into the digital world by learning Microsoft Office tools. This foundational step introduced me to computers and sparked my curiosity for technology.',
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
