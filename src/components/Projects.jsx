import { useRef, useEffect } from 'react';

const projects = [
  {
    number: '01',
    title: 'Fair-Grade',
    category: 'Multi-Agent AI',
    tools: 'TypeScript, React, Gemini API, FastAPI',
    image: '/images/project-1.webp',
    github: 'https://github.com/Yashasm18/Fair-Grade',
    live: 'https://team-vektor-fairgrade.vercel.app/'
  },
  {
    number: '02',
    title: 'ForgeAgent',
    category: 'Agentic AI / Safety',
    tools: 'Python, MCP, Capability Memory, LLM Tools',
    image: '/images/project-2.webp',
    github: 'https://github.com/Yashasm18/ForgeAgent',
    live: 'https://yashasm18.github.io/ForgeAgent/'
  },
  {
    number: '03',
    title: 'Email Triage Env',
    category: 'Autonomous Agents',
    tools: 'Python, PyTorch, OpenEnv, Chain-of-Thought',
    image: '/images/project-3.webp',
    github: 'https://github.com/Yashasm18/email-triage-env',
    live: 'https://huggingface.co/spaces/souller/email-triage-env'
  },
  {
    number: '04',
    title: 'Kyvra',
    category: 'Systems / In-Memory Store',
    tools: 'Java, NIO Event Loops, Lock-striped Shards, AOF',
    image: '/images/project-4.webp',
    github: 'https://github.com/Yashasm18/kyvra'
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
