import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Navbar() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="header-nav">
      <div className="nav-container">
        <Link to="/" className="brand-logo">
          <img src="/images/pandalogo.png" alt="판다마켓 로고" />
        </Link>

        <div className="nav-menu-group">
          <Link 
            to="/board" 
            className={`board-link ${location.pathname === '/board' ? 'active' : ''}`}
          >
            자유게시판
          </Link>
          <Link 
            to="/market" 
            className={`market-link ${location.pathname === '/market' ? 'active' : ''}`}
          >
            중고마켓
          </Link>
        </div>

        <div className="nav-right">
          {isAuthenticated ? (
            <button onClick={logout} className="login-button">로그아웃</button>
          ) : (
            <Link to="/login" className="login-button">로그인</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;