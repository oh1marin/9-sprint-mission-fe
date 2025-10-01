import { Link } from 'react-router-dom';
import '../styles/global.css';
import pandaLogo from '../assets/images/pandalogo.png';

function FAQPage() {
  return (
    <div className="page-container">
      {/* 상단 메뉴 */}
      <nav className="header-nav">
        <div className="nav-container">
          <Link to="/" className="brand-logo">
            <img src={pandaLogo} alt="판다마켓 로고" />
          </Link>
          <Link to="/login" className="login-button">로그인</Link>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="main-content empty-page-container">
        <div className="empty-page-content">
          <h1>자주 묻는 질문</h1>
          <p>판다마켓 FAQ 페이지입니다.<br />현재 준비 중인 페이지입니다.</p>
          <Link to="/" className="back-to-home-button">홈으로 돌아가기</Link>
        </div>
      </main>
    </div>
  );
}

export default FAQPage;