import '../styles/techstack.css';

const techs = [
  { name: 'Python', icon: 'python' },
  { name: 'JavaScript', icon: 'js' },
  { name: 'TypeScript', icon: 'ts' },
  { name: 'C', icon: 'c' },
  { name: 'C++', icon: 'cpp' },
  { name: 'Kotlin', icon: 'kotlin' },
  { name: 'HTML', icon: 'html' },
  { name: 'CSS', icon: 'css' },
  { name: 'Bash', icon: 'bash' },
  { name: 'React', icon: 'react' },
  { name: 'Next.js', icon: 'nextjs' },
  { name: 'Bootstrap', icon: 'bootstrap' },
  { name: 'Node.js', icon: 'node' },
  { name: 'Django', icon: 'django' },
  { name: 'Flask', icon: 'flask' },
  { name: 'FastAPI', icon: 'fastapi' },
  { name: 'TensorFlow', icon: 'tensorflow' },
  { name: 'PyTorch', icon: 'pytorch' },
  { name: 'Scikit-learn', icon: 'scikit' },
  { name: 'OpenCV', icon: 'opencv' },
  { name: 'NumPy', icon: 'numpy' },
  { name: 'Tailwind', icon: 'tailwind' },
  { name: 'Pandas', icon: 'pandas' },
  { name: 'MySQL', icon: 'mysql' },
  { name: 'PostgreSQL', icon: 'postgres' },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'Firebase', icon: 'firebase' },
  { name: 'Redis', icon: 'redis' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Azure', icon: 'azure' },
  { name: 'Git', icon: 'git' },
  { name: 'GitHub', icon: 'github' },
  { name: 'Linux', icon: 'linux' },
  { name: 'AWS', icon: 'aws' },
  { name: 'VS Code', icon: 'vscode' },
  { name: 'Vercel', icon: 'vercel' },
  { name: 'Jupyter', icon: 'jupyter' },
  { name: 'Figma', icon: 'figma' },
  { name: 'Postman', icon: 'postman' },
  { name: 'Photoshop', icon: 'photoshop' },
  { name: 'Hugging Face', icon: 'huggingface' },
  { name: 'MS Office', icon: 'msoffice' }
];

export default function TechStack() {
  return (
    <section className="section tech-stack" id="tech-stack">
      <div className="container">
        <h2 className="tech-stack-title">TECH STACK</h2>
        
        <div className="tech-grid-wrapper">
          <div className="tech-grid">
            {techs.map((tech, index) => (
              <div className="tech-card" key={index}>
                <div className="tech-icon-placeholder">
                  {/* Since we don't have SVGs, we'll use a stylized dot or letter */}
                  <div className="fake-icon">{tech.name.charAt(0)}</div>
                </div>
                <span className="tech-name">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
