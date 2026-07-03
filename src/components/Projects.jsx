import { useRef, useEffect } from 'react';
import '../styles/projects.css';

const projects = [
  {
    number: '01',
    title: 'Project 01',
    category: 'AI / Software',
    tools: 'Python, React, APIs, Automation',
    image: '/images/placeholder.webp',
  },
  {
    number: '02',
    title: 'Project 02',
    category: 'Full Stack',
    tools: 'React, Node.js, Database, REST APIs',
    image: '/images/placeholder.webp',
  },
  {
    number: '03',
    title: 'Project 03',
    category: 'Automation',
    tools: 'Python, Scripts, APIs, Workflows',
    image: '/images/placeholder.webp',
  },
  {
    number: '04',
    title: 'Project 04',
    category: 'Web App',
    tools: 'React, UI Design, Backend, Deployment',
    image: '/images/placeholder.webp',
  }
];

export default function Projects() {
  const scrollRef = useRef(null);

  // Optional: Horizontal scrolling with mouse wheel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        // If scrolling vertically, translate to horizontal scroll within this container
        // Only if the mouse is hovering over the container
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section className="projects-section" id="projects">
      <div className="container">
        <h2 className="projects-header-title">
          My <span className="projects-highlight">Work</span>
        </h2>
      </div>

      <div className="projects-carousel" ref={scrollRef}>
        <div className="projects-track">
          {projects.map((project, index) => (
            <div className="project-slide" key={index}>
              <div className="project-slide-top">
                <div className="project-number-title">
                  <span className="p-num">{project.number}</span>
                </div>
                <div className="project-title-cat">
                  <h3 className="p-title">{project.title}</h3>
                  <span className="p-cat">{project.category}</span>
                </div>
              </div>

              <div className="project-slide-middle">
                <h4 className="p-tools-label">Tools and features</h4>
                <p className="p-tools-text">{project.tools}</p>
              </div>

              <div className="project-slide-bottom">
                <div className="p-image-container">
                  <img src={project.image} alt={project.title} className="p-image" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
