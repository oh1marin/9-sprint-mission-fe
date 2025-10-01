import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../hooks/useAuth';
import '../styles/global.css';

function RegistrationPage() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    tags: []
  });

  const [errors, setErrors] = useState({
    productName: '',
    description: '',
    price: '',
    tag: ''
  });

  const [tagInput, setTagInput] = useState('');

  // 유효성 검증 함수들
  const validateProductName = (value) => {
    if (!value || value.length === 0) {
      return '상품명을 입력해주세요';
    }
    if (value.length > 10) {
      return '상품명은 10자 이내로 입력해주세요';
    }
    return '';
  };

  const validateDescription = (value) => {
    if (!value || value.length === 0) {
      return '상품 소개를 입력해주세요';
    }
    if (value.length < 10) {
      return '상품 소개는 10자 이상 입력해주세요';
    }
    if (value.length > 100) {
      return '상품 소개는 100자 이내로 입력해주세요';
    }
    return '';
  };

  const validatePrice = (value) => {
    if (!value) {
      return '판매 가격을 입력해주세요';
    }
    if (isNaN(value) || Number(value) <= 0) {
      return '올바른 가격을 입력해주세요';
    }
    return '';
  };

  const validateTag = (value) => {
    if (value.length > 5) {
      return '태그는 5글자 이내로 입력해주세요';
    }
    return '';
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    // 실시간 유효성 검증
    let error = '';
    if (id === 'productName') error = validateProductName(value);
    else if (id === 'description') error = validateDescription(value);
    else if (id === 'price') error = validatePrice(value);

    setErrors(prev => ({ ...prev, [id]: error }));
  };

  // 태그 입력 변경
  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    const error = validateTag(value);
    setErrors(prev => ({ ...prev, tag: error }));
  };

  // 태그 추가 (Enter 키)
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = tagInput.trim();

      if (value && value.length <= 5) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, value]
        }));
        setTagInput('');
        setErrors(prev => ({ ...prev, tag: '' }));
      }
    }
  };

  // 태그 제거
  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return (
      formData.productName.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.price !== '' &&
      !errors.productName &&
      !errors.description &&
      !errors.price &&
      formData.productName.length >= 1 &&
      formData.productName.length <= 10 &&
      formData.description.length >= 10 &&
      formData.description.length <= 100 &&
      !isNaN(formData.price) &&
      Number(formData.price) > 0
    );
  };

  // 폼 제출
  const handleSubmit = async () => {
    if (!isFormValid()) return;

    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const newProduct = await addProduct({
        name: formData.productName,
        description: formData.description,
        price: Number(formData.price),
        tags: formData.tags
      });

      alert('상품이 등록되었습니다!');
      navigate('/market');
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ fontFamily: 'Pretendard, sans-serif', backgroundColor: '#f9fafb', margin: 0, padding: 0 }}>
      {/* 상단 네비게이션 */}
      <nav className="header-nav" style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="nav-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <Link to="/" className="brand-logo" style={{ fontSize: '20px', fontWeight: 700, color: '#3692FF', textDecoration: 'none' }}>
            판다마켓
          </Link>

          <div className="nav-menu-group" style={{ display: 'flex', gap: '16px' }}>
            <Link to="/board" style={{ padding: '8px 16px', textDecoration: 'none', color: '#6b7280', fontWeight: 500, transition: 'color 0.2s' }}>
              자유게시판
            </Link>
            <Link to="/market" style={{ padding: '8px 16px', textDecoration: 'none', color: '#3692FF', fontWeight: 600, transition: 'color 0.2s' }}>
              중고마켓
            </Link>
          </div>

          <Link to="/login" className="login-button" style={{ padding: '8px 24px', backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, transition: 'background-color 0.2s' }}>
            로그인
          </Link>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '896px', margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', color: '#111827' }}>
          상품 등록하기
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 상품명 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              상품명 <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              id="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="상품명을 입력해주세요"
              className={errors.productName ? 'error' : ''}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.productName ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Pretendard, sans-serif',
                transition: 'all 0.2s',
                backgroundColor: '#f9fafb'
              }}
            />
            {errors.productName && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.productName}
              </div>
            )}
          </div>

          {/* 상품 소개 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              상품 소개 <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="상품 소개를 입력해주세요"
              rows="5"
              className={errors.description ? 'error' : ''}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.description ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Pretendard, sans-serif',
                transition: 'all 0.2s',
                backgroundColor: '#f9fafb',
                resize: 'none',
                minHeight: '120px'
              }}
            />
            {errors.description && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.description}
              </div>
            )}
          </div>

          {/* 판매 가격 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              판매 가격 <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              id="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="판매 가격을 입력해주세요"
              className={errors.price ? 'error' : ''}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.price ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Pretendard, sans-serif',
                transition: 'all 0.2s',
                backgroundColor: '#f9fafb'
              }}
            />
            {errors.price && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.price}
              </div>
            )}
          </div>

          {/* 태그 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              태그
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyPress={handleTagKeyPress}
              placeholder="태그를 입력 후 Enter"
              className={errors.tag ? 'error' : ''}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1px solid ${errors.tag ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Pretendard, sans-serif',
                transition: 'all 0.2s',
                backgroundColor: '#f9fafb'
              }}
            />
            {errors.tag && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                {errors.tag}
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    borderRadius: '999px',
                    fontSize: '14px',
                    gap: '6px',
                    transition: 'background-color 0.2s'
                  }}
                >
                  #{tag}
                  <span
                    onClick={() => removeTag(index)}
                    style={{ cursor: 'pointer', color: '#6b7280', fontWeight: 600, transition: 'color 0.2s' }}
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 등록 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: isFormValid() ? '#3b82f6' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            등록
          </button>
        </div>
      </main>
    </div>
  );
}

export default RegistrationPage;