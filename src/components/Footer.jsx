import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        
        <h1 className="footer-huge-name">YASHAS M</h1>

        <div className="footer-grid">
          
          {/* Column 1: Email & Location */}
          <div className="footer-col">
            <div className="footer-group">
              <span className="footer-label">Email</span>
              <a href="mailto:yashasm1807@gmail.com" className="footer-text">yashasm1807@gmail.com</a>
            </div>
            <div className="footer-group">
              <span className="footer-label">Location</span>
              <span className="footer-text">Bengaluru, Karnataka, India</span>
            </div>
          </div>

          {/* Column 2: Socials */}
          <div className="footer-col">
            <span className="footer-label">Social</span>
            <ul className="footer-social-list">
              <li><a href="https://github.com/yashasm1807" target="_blank" rel="noreferrer">Github ↗</a></li>
              <li><a href="https://linkedin.com/in/yashasm1807" target="_blank" rel="noreferrer">Linkedin ↗</a></li>
              <li><a href="https://x.com/yashasm1807" target="_blank" rel="noreferrer">Twitter ↗</a></li>
              <li><a href="https://instagram.com/yashasm1807" target="_blank" rel="noreferrer">Instagram ↗</a></li>
            </ul>
          </div>

          {/* Column 3: Credits */}
          <div className="footer-col footer-col-right">
            <p className="footer-credits">
              Designed and Developed<br />
              by <span className="highlight-name">Yashas M</span>
            </p>
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()}
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
