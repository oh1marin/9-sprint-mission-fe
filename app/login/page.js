'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    if (touched[id]) {
      const error = id === 'email' 
        ? validateEmailField(value)
        : validatePasswordField(value);
      setErrors(prev => ({ ...prev, [id]: error }));
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    
    const error = id === 'email'
      ? validateEmailField(value)
      : validatePasswordField(value);
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmailField(formData.email);
    const passwordError = validatePasswordField(formData.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });
    
    if (emailError || passwordError) return;
    
    try {
      await login(formData.email, formData.password);
      router.push('/market');
    } catch (error) {
      alert(error.message || '로그인에 실패했습니다.');
    }
  };

  const isFormValid = 
    formData.email && 
    formData.password && 
    !errors.email && 
    !errors.password;

  return (
    <div className="page-container">
      <nav className="header-nav">
        <div className="nav-container">
          <Link href="/" className="brand-logo">
            <Image src="/images/pandalogo.png" alt="판다마켓 로고" width={120} height={40} />
          </Link>
          <Link href="/login" className="login-button">로그인</Link>
        </div>
      </nav>

      <main className="main-content center-container">
        <div className="form-container">
          <div className="form-logo">
            <Image src="/images/pandalogo.png" alt="판다 로고" width={120} height={40} />
          </div>

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

          <div className="social-login-bar">
            <span className="social-login-text">간편 로그인하기</span>
            <div className="social-icons-container">
              <a className="social-icon-link google" href="https://www.google.com/" target="_blank" rel="noopener noreferrer">G</a>
              <a className="social-icon-link kakao" href="https://www.kakaocorp.com/page/" target="_blank" rel="noopener noreferrer">K</a>
            </div>
          </div>

          <div className="bottom-navigation-link">
            판다마켓이 처음이신가요? <Link href="/signup">회원가입</Link>
          </div>
        </div>
      </main>
    </div>
  );
}