import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/global.css';
import pandaLogo from '../assets/images/pandalogo.png';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  // 이메일 유효성 검증
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검증 (8자 이상)
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // 이메일 필드 검증
  const validateEmailField = (value) => {
    if (!value) {
      return '이메일을 입력해주세요.';
    }
    if (!validateEmail(value)) {
      return '잘못된 이메일 형식입니다';
    }
    return '';
  };

  // 비밀번호 필드 검증
  const validatePasswordField = (value) => {
    if (!value) {
      return '비밀번호를 입력해주세요.';
    }
    if (!validatePassword(value)) {
      return '비밀번호를 8자 이상 입력해주세요.';
    }
    return '';
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // 이미 에러가 표시된 필드는 실시간 검증
    if (touched[id]) {
      const error = id === 'email' 
        ? validateEmailField(value)
        : validatePasswordField(value);
      setErrors(prev => ({ ...prev, [id]: error }));
    }
  };

  // 포커스 아웃 핸들러
  const handleBlur = (e) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    
    const error = id === 'email'
      ? validateEmailField(value)
      : validatePasswordField(value);
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 모든 필드 유효성 검증
    const emailError = validateEmailField(formData.email);
    const passwordError = validatePasswordField(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    if (emailError || passwordError) {
      return;
    }
    
    try {
      await login(formData.email, formData.password);
      navigate('/market');
    } catch (error) {
      alert(error.message || '로그인에 실패했습니다.');
    }
  };

  // 버튼 활성화 여부
  const isFormValid = 
    formData.email && 
    formData.password && 
    !errors.email && 
    !errors.password;

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
      <main className="main-content center-container">
        <div className="form-container">
          {/* 로고 */}
          <div className="form-logo">
            <img src={pandaLogo} alt="판다 로고" />
          </div>

          {/* 폼 */}
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">이메일</label>
              <input
                id="email"
                type="email"
                className={`text-input ${errors.email ? 'error' : ''}`}
                placeholder="이메일을 입력해주세요"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">비밀번호</label>
              <div className="password-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`text-input ${errors.password ? 'error' : ''}`}
                  placeholder="비밀번호를 입력해주세요"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className={`submit-button ${isFormValid ? 'active' : ''}`}
              disabled={!isFormValid}
            >
              로그인
            </button>
          </form>

          {/* 간편 로그인 */}
          <div className="social-login-bar">
            <span className="social-login-text">간편 로그인하기</span>
            <div className="social-icons-container">
              <a className="social-icon-link google" href="https://www.google.com/" target="_blank" rel="noopener noreferrer">G</a>
              <a className="social-icon-link kakao" href="https://www.kakaocorp.com/page/" target="_blank" rel="noopener noreferrer">K</a>
            </div>
          </div>

          {/* 하단 링크 */}
          <div className="bottom-navigation-link">
            판다마켓이 처음이신가요? <Link to="/signup">회원가입</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;