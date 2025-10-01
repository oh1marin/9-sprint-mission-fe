import { Link } from 'react-router-dom';
import '../styles/global.css';
import pandaLogo from '../assets/images/pandalogo.png';

function ItemsPage() {
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
          <h1>상품 목록</h1>
          <p>아직 준비 중인 페이지입니다.<br />곧 다양한 상품들을 만나보실 수 있어요!</p>
          <Link to="/" className="back-to-home-button">홈으로 돌아가기</Link>
        </div>
      </main>
    </div>
  );
}

export default ItemsPage;