import React, { useState } from 'react';
import { useValidation } from '../hooks/useValidation';
import { createProduct } from '../services/ProductService';

const RegistrationPage = () => {
  const { errors, touched, validate, validateAll, setFieldTouched, isFormValid } = useValidation();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input 값 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    validate(field, value);
  };

  // Input focus out 핸들러
  const handleBlur = (field) => {
    setFieldTouched(field);
    validate(field, formData[field]);
  };

  // 태그 입력 핸들러
  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    validate('tag', value);
  };

  // 엔터키로 태그 추가
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      
      // 태그 유효성 검사
      if (validate('tag', tagInput)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        });
        setTagInput('');
      }
    }
  };

  // 태그 삭제
  const removeTag = (indexToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, index) => index !== indexToRemove)
    });
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 전체 유효성 검사
    if (!validateAll(formData)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createProduct(
        formData.name,
        formData.description,
        Number(formData.price),
        formData.tags,
        [] // images는 빈 배열로
      );

      // 등록 성공 시 상품 상세 페이지로 이동 (빈 페이지)
      window.location.href = `/items/${response.id}`;
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 등록 버튼 활성화 여부
  const canSubmit = isFormValid(formData) && !isSubmitting;

  return (
    <div className="registration-page">
      <div className="container">
        <h1 className="page-title">상품 등록하기</h1>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* 상품명 */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">상품명</label>
            <input
              id="name"
              type="text"
              className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
              placeholder="상품명을 입력해주세요"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
            />
            {touched.name && errors.name && (
              <p className="error-message">{errors.name}</p>
            )}
          </div>

          {/* 상품 소개 */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">상품 소개</label>
            <textarea
              id="description"
              className={`form-textarea ${touched.description && errors.description ? 'error' : ''}`}
              placeholder="상품 소개를 입력해주세요"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              rows="4"
            />
            {touched.description && errors.description && (
              <p className="error-message">{errors.description}</p>
            )}
          </div>

          {/* 판매 가격 */}
          <div className="form-group">
            <label htmlFor="price" className="form-label">판매 가격</label>
            <input
              id="price"
              type="text"
              className={`form-input ${touched.price && errors.price ? 'error' : ''}`}
              placeholder="판매 가격을 입력해주세요"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              onBlur={() => handleBlur('price')}
            />
            {touched.price && errors.price && (
              <p className="error-message">{errors.price}</p>
            )}
          </div>

          {/* 태그 */}
          <div className="form-group">
            <label htmlFor="tags" className="form-label">태그</label>
            <input
              id="tags"
              type="text"
              className={`form-input ${touched.tag && errors.tag ? 'error' : ''}`}
              placeholder="태그를 입력 후 Enter"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyPress={handleTagKeyPress}
            />
            {touched.tag && errors.tag && (
              <p className="error-message">{errors.tag}</p>
            )}
            
            {/* 태그 칩 목록 */}
            {formData.tags.length > 0 && (
              <div className="tag-list">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="tag-chip">
                    <span>{tag}</span>
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeTag(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 등록 버튼 */}
          <button
            type="submit"
            className={`submit-button ${canSubmit ? 'active' : ''}`}
            disabled={!canSubmit}
          >
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;