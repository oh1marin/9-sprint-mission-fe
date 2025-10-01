import { Link } from 'react-router-dom';
import '../styles/global.css';
import pandaLogo from '../assets/images/pandalogo.png';
import facebookIcon from '../assets/images/facebook.png';
import twitterIcon from '../assets/images/tw.png';
import youtubeIcon from '../assets/images/youtube.png';
import instaIcon from '../assets/images/insta.png';

function BoardPage() {
  return (
    <>
      {/* 헤더 */}
      <nav className="header-nav">
        <div className="nav-container">
          <Link to="/" className="brand-logo">
            <img src={pandaLogo} alt="판다마켓 로고" />
          </Link>
          <div className="nav-menu-group">
            <Link to="/board" className="board-link active">자유게시판</Link>
            <Link to="/market" className="market-link">중고마켓</Link>
          </div>
          <div className="nav-right">
            <Link to="/login" className="login-button">로그인</Link>
          </div>
        </div>
      </nav>

      {/* 메인 */}
      <main className="main-content">
        <div className="empty-page-container">
          <div className="empty-page-content">
            <h1>자유게시판</h1>
            <p>현재 준비중입니다!</p>
            <Link to="/" className="back-to-home-button">홈으로 가기</Link>
          </div>
        </div>
      </main>

      {/* 푸터 */}
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

export default BoardPage;