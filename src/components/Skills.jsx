import { useState } from 'react';
import '../styles/skills.css';

const services = [
  {
    title: 'SOFTWARE ENGINEER',
    subtitle: 'Designing robust systems & scalable software',
    desc: 'Building reliable, maintainable software through clean architecture, efficient algorithms, and solid engineering practices. Focused on system design, performance optimization, and delivering production-ready applications.',
    tools: ['Java', 'Python', 'C++', 'DSA', 'System Design', 'OOP', 'REST APIs', 'CI/CD', 'Testing', 'Git']
  },
  {
    title: 'FULL-STACK',
    subtitle: 'Modern web development & scalable applications',
    desc: 'Building responsive and performant web applications using React, Next.js, Node.js, and databases. Creating seamless user experiences with modern UI/UX principles.',
    tools: ['React', 'Next.js', 'Node.js', 'TypeScript']
  }
];

export default function Skills() {
  const [expandedIndex, setExpandedIndex] = useState(1); // Default second one open

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="section skills" id="skills">
      <div className="container">
        <div className="skills-grid">
          
          {/* Left Side: Title */}
          <div className="skills-left">
            <h2 className="skills-title">
              WHAT I DO
            </h2>
          </div>

          {/* Right Side: Accordion */}
          <div className="skills-right">
            <div className="accordion">
              {services.map((service, index) => {
                const isExpanded = expandedIndex === index;
                return (
                  <div 
                    className={`accordion-item ${isExpanded ? 'expanded' : ''}`} 
                    key={index}
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="accordion-header">
                      <div>
                        <h3 className="accordion-title">{service.title}</h3>
                        <p className="accordion-subtitle">{service.subtitle}</p>
                      </div>
                      <button className="accordion-icon">
                        {isExpanded ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                        )}
                      </button>
                    </div>
                    
                    <div className="accordion-content">
                      <p className="accordion-desc">{service.desc}</p>
                      
                      <div className="accordion-tools">
                        <span className="tools-label">Skillset & tools</span>
                        <div className="tools-tags">
                          {service.tools.map(tool => (
                            <span className="tool-tag" key={tool}>{tool}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
