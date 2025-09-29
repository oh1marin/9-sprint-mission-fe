import { useState } from 'react';

/**
 * 상품 등록 폼 유효성 검사 커스텀 훅
 * @returns {Object} 유효성 검사 상태와 함수들
 */
export const useValidation = () => {
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    tag: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    description: false,
    price: false,
    tag: false
  });

  /**
   * 상품명 유효성 검사
   * 조건: 1자 이상, 10자 이내
   */
  const validateName = (value) => {
    if (!value || value.trim().length === 0) {
      return '상품명을 입력해주세요.';
    }
    if (value.length > 10) {
      return '상품명은 10자 이내로 입력해주세요.';
    }
    return '';
  };

  /**
   * 상품 소개 유효성 검사
   * 조건: 10자 이상, 100자 이내
   */
  const validateDescription = (value) => {
    if (!value || value.trim().length === 0) {
      return '상품 소개를 입력해주세요.';
    }
    if (value.length < 10) {
      return '상품 소개는 10자 이상 입력해주세요.';
    }
    if (value.length > 100) {
      return '상품 소개는 100자 이내로 입력해주세요.';
    }
    return '';
  };

  /**
   * 판매 가격 유효성 검사
   * 조건: 1자 이상, 숫자
   */
  const validatePrice = (value) => {
    if (!value || value.trim().length === 0) {
      return '판매 가격을 입력해주세요.';
    }
    if (isNaN(value) || Number(value) <= 0) {
      return '올바른 가격을 입력해주세요.';
    }
    return '';
  };

  /**
   * 태그 유효성 검사
   * 조건: 5글자 이내
   */
  const validateTag = (value) => {
    if (value && value.length > 5) {
      return '태그는 5글자 이내로 입력해주세요.';
    }
    return '';
  };

  /**
   * 필드별 유효성 검사 실행
   */
  const validate = (field, value) => {
    let error = '';

    switch (field) {
      case 'name':
        error = validateName(value);
        break;
      case 'description':
        error = validateDescription(value);
        break;
      case 'price':
        error = validatePrice(value);
        break;
      case 'tag':
        error = validateTag(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error
    }));

    return error === '';
  };

  /**
   * 필드 터치 상태 업데이트
   */
  const setFieldTouched = (field, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [field]: isTouched
    }));
  };

  /**
   * 모든 필드 유효성 검사
   */
  const validateAll = (values) => {
    const nameError = validateName(values.name);
    const descriptionError = validateDescription(values.description);
    const priceError = validatePrice(values.price);

    setErrors({
      name: nameError,
      description: descriptionError,
      price: priceError,
      tag: ''
    });

    setTouched({
      name: true,
      description: true,
      price: true,
      tag: true
    });

    return !nameError && !descriptionError && !priceError;
  };

  /**
   * 모든 필드가 채워졌는지 확인
   */
  const isFormValid = (values) => {
    return (
      values.name &&
      values.description &&
      values.price &&
      !errors.name &&
      !errors.description &&
      !errors.price
    );
  };

  /**
   * 에러 초기화
   */
  const resetErrors = () => {
    setErrors({
      name: '',
      description: '',
      price: '',
      tag: ''
    });
    setTouched({
      name: false,
      description: false,
      price: false,
      tag: false
    });
  };

  return {
    errors,
    touched,
    validate,
    validateAll,
    setFieldTouched,
    isFormValid,
    resetErrors
  };
};