import { useRef, useEffect } from 'react';
import '../styles/projects.css';

const projects = [
  {
    number: '01',
    title: 'Drishti',
    category: 'AI / LLM',
    tools: 'Python, PyTorch, Transformers, FastAPI, React, MongoDB',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop', // Placeholder since I don't have the real image
  },
  {
    number: '02',
    title: 'VoteChain',
    category: 'Blockchain',
    tools: 'Solidity, Web3.js, React, Ethereum, IPFS, MetaMask, Node.js',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f4ec651?q=80&w=800&auto=format&fit=crop',
  },
  {
    number: '03',
    title: 'EIE - Earthquake Impact Estimator',
    category: 'IoT / Hardware',
    tools: 'Arduino, C++, IoT Sensors, Python, ML, React',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  },
  {
    number: '04',
    title: 'GameKroy',
    category: 'Full Stack',
    tools: 'React, Node.js, MongoDB, Express, Stripe, TailwindCSS',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop',
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
