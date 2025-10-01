import { Link } from 'react-router-dom';
import '../styles/global.css';
import '../styles/pages/index.css';

import pandaLogo from '../assets/images/pandalogo.png';
import panda1 from '../assets/images/panda1.png';
import panda2 from '../assets/images/panda2.png';
import panda3 from '../assets/images/panda3.png';
import panda4 from '../assets/images/panda4.png';
import panda5 from '../assets/images/panda5.png';
import facebookIcon from '../assets/images/facebook.png';
import twitterIcon from '../assets/images/tw.png';
import youtubeIcon from '../assets/images/youtube.png';
import instaIcon from '../assets/images/insta.png';

function IndexPage() {
  return (
    <>
      <nav className="header-nav">
        <div className="nav-container">
          <Link to="/" className="brand-logo">
            <img src={pandaLogo} alt="판다마켓 로고" />
          </Link>
          <div className="nav-menu-group">
            <Link to="/board" className="board-link">자유게시판</Link>
            <Link to="/market" className="market-link">중고마켓</Link>
          </div>
          <div className="nav-right">
            <Link to="/login" className="login-button">로그인</Link>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <Link to="/market" className="hero-image-link" aria-label="중고마켓으로 이동">
            <img src={panda1} alt="판다마켓 메인 이미지" />
          </Link>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="section-image">
            <img src={panda2} alt="상품 등록 이미지" />
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="section-image">
            <img src={panda3} alt="핫한 상품 이미지" />
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="section-image">
            <img src={panda4} alt="판매 등록 이미지" />
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="hero-content">
          <div className="section-image">
            <img src={panda5} alt="안전거래 이미지" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-text">©codeit - 2024</div>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="Facebook">
              <img src={facebookIcon} alt="Facebook" width="20" height="20" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="Twitter">
              <img src={twitterIcon} alt="Twitter" width="20" height="20" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="YouTube">
              <img src={youtubeIcon} alt="YouTube" width="20" height="20" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="Instagram">
              <img src={instaIcon} alt="Instagram" width="20" height="20" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default IndexPage;