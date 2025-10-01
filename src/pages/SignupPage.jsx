import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/global.css';
import pandaLogo from '../assets/images/pandalogo.png';

function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const [touched, setTouched] = useState({
    email: false,
    nickname: false,
    password: false,
    passwordConfirm: false
  });

  // 유효성 검증 함수들
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateEmailField = (value) => {
    if (!value) return '이메일을 입력해주세요.';
    if (!validateEmail(value)) return '잘못된 이메일 형식입니다';
    return '';
  };

  const validatePasswordField = (value) => {
    if (!value) return '비밀번호를 입력해주세요.';
    if (!validatePassword(value)) return '비밀번호를 8자 이상 입력해주세요.';
    return '';
  };

  const validatePasswordConfirmField = (value) => {
    if (!value) return '비밀번호 확인을 입력해주세요.';
    if (value !== formData.password) return '비밀번호가 일치하지 않습니다.';
    return '';
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // 실시간 검증
    if (touched[id]) {
      let error = '';
      if (id === 'email') error = validateEmailField(value);
      else if (id === 'password') error = validatePasswordField(value);
      else if (id === 'passwordConfirm') error = validatePasswordConfirmField(value);
      
      setErrors(prev => ({ ...prev, [id]: error }));
      
      // 비밀번호 변경 시 확인 필드도 재검증
      if (id === 'password' && formData.passwordConfirm && touched.passwordConfirm) {
        setErrors(prev => ({
          ...prev,
          passwordConfirm: value !== formData.passwordConfirm ? '비밀번호가 일치하지 않습니다.' : ''
        }));
      }
    }
  };

  // 포커스 아웃 핸들러
  const handleBlur = (e) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    
    let error = '';
    if (id === 'email') error = validateEmailField(value);
    else if (id === 'password') {
      error = validatePasswordField(value);
      // 비밀번호 확인 필드도 재검증
      if (formData.passwordConfirm) {
        setErrors(prev => ({
          ...prev,
          passwordConfirm: validatePasswordConfirmField(formData.passwordConfirm)
        }));
      }
    }
    else if (id === 'passwordConfirm') error = validatePasswordConfirmField(value);
    
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 모든 필드 검증
    const emailError = validateEmailField(formData.email);
    const passwordError = validatePasswordField(formData.password);
    const confirmError = validatePasswordConfirmField(formData.passwordConfirm);
    
    setErrors({
      email: emailError,
      nickname: '',
      password: passwordError,
      passwordConfirm: confirmError
    });
    
    if (emailError || passwordError || confirmError) {
      return;
    }
    
    try {
      await register({
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password
      });
      navigate('/login');
    } catch (error) {
      if (error.message.includes('이메일')) {
        alert('사용 중인 이메일입니다');
      } else {
        alert(error.message || '회원가입에 실패했습니다.');
      }
    }
  };

  // 버튼 활성화 여부
  const isFormValid = 
    formData.email && 
    formData.nickname && 
    formData.password && 
    formData.passwordConfirm && 
    !errors.email && 
    !errors.password && 
    !errors.passwordConfirm;

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
          <form id="signup-form" onSubmit={handleSubmit}>
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
              <label htmlFor="nickname" className="input-label">닉네임</label>
              <input
                id="nickname"
                type="text"
                className="text-input"
                placeholder="닉네임을 입력해주세요"
                value={formData.nickname}
                onChange={handleChange}
                required
              />
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

            <div className="input-group">
              <label htmlFor="passwordConfirm" className="input-label">비밀번호 확인</label>
              <div className="password-container">
                <input
                  id="passwordConfirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  className={`text-input ${errors.passwordConfirm ? 'error' : ''}`}
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  {showPasswordConfirm ? '🙈' : '👁'}
                </button>
              </div>
              {errors.passwordConfirm && <div className="error-message">{errors.passwordConfirm}</div>}
            </div>

            <button
              type="submit"
              className={`submit-button ${isFormValid ? 'active' : ''}`}
              disabled={!isFormValid}
            >
              회원가입
            </button>
          </form>

          {/* 간편 회원가입 */}
          <div className="social-login-bar">
            <span className="social-login-text">간편 회원가입하기</span>
            <div className="social-icons-container">
              <a className="social-icon-link google" href="https://www.google.com/" target="_blank" rel="noopener noreferrer">G</a>
              <a className="social-icon-link kakao" href="https://www.kakaocorp.com/page/" target="_blank" rel="noopener noreferrer">K</a>
            </div>
          </div>

          {/* 하단 링크 */}
          <div className="bottom-navigation-link">
            이미 회원이신가요? <Link to="/login">로그인</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignupPage;