'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const router = useRouter();
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    if (touched[id]) {
      let error = '';
      if (id === 'email') error = validateEmailField(value);
      else if (id === 'password') error = validatePasswordField(value);
      else if (id === 'passwordConfirm') error = validatePasswordConfirmField(value);
      
      setErrors(prev => ({ ...prev, [id]: error }));
      
      if (id === 'password' && formData.passwordConfirm && touched.passwordConfirm) {
        setErrors(prev => ({
          ...prev,
          passwordConfirm: value !== formData.passwordConfirm ? '비밀번호가 일치하지 않습니다.' : ''
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    
    let error = '';
    if (id === 'email') error = validateEmailField(value);
    else if (id === 'password') {
      error = validatePasswordField(value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmailField(formData.email);
    const passwordError = validatePasswordField(formData.password);
    const confirmError = validatePasswordConfirmField(formData.passwordConfirm);
    
    setErrors({
      email: emailError,
      nickname: '',
      password: passwordError,
      passwordConfirm: confirmError
    });
    
    if (emailError || passwordError || confirmError) return;
    
    try {
      await register({
        email: formData.email,
        nickname: formData.nickname,
        password: formData.password
      });
      router.push('/login');
    } catch (error) {
      if (error.message.includes('이메일')) {
        alert('사용 중인 이메일입니다');
      } else {
        alert(error.message || '회원가입에 실패했습니다.');
      }
    }
  };

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

          <div className="social-login-bar">
            <span className="social-login-text">간편 회원가입하기</span>
            <div className="social-icons-container">
              <a className="social-icon-link google" href="https://www.google.com/" target="_blank" rel="noopener noreferrer">G</a>
              <a className="social-icon-link kakao" href="https://www.kakaocorp.com/page/" target="_blank" rel="noopener noreferrer">K</a>
            </div>
          </div>

          <div className="bottom-navigation-link">
            이미 회원이신가요? <Link href="/login">로그인</Link>
          </div>
        </div>
      </main>
    </div>
  );
}