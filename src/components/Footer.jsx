import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-text">©codeit - 2024</div>
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/faq">FAQ</Link>
        </div>
        <div className="footer-social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="Facebook">
            <img src="/images/facebook.png" alt="Facebook" width="20" height="20" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="Twitter">
            <img src="/images/tw.png" alt="Twitter" width="20" height="20" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="YouTube">
            <img src="/images/youtube.png" alt="YouTube" width="20" height="20" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="Instagram">
            <img src="/images/insta.png" alt="Instagram" width="20" height="20" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;