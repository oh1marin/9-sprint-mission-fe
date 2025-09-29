import { useState, useEffect, useCallback } from 'react';

/**
 * 반응형 pageSize를 관리하는 커스텀 훅
 * @param {string} type - 'best' 또는 'products'
 * @returns {number} pageSize - 현재 화면 크기에 맞는 pageSize
 */
export const useResponsive = (type = 'products') => {
  const [pageSize, setPageSize] = useState(10);

  // 화면 크기에 따른 pageSize 계산
  const calculatePageSize = useCallback(() => {
    const width = window.innerWidth;
    
    if (type === 'best') {
      // 베스트 상품: Desktop 4개, Tablet 2개, Mobile 1개
      if (width >= 1200) return 4;
      if (width >= 744) return 2;
      return 1;
    } else {
      // 전체 상품: Desktop 10개, Tablet 6개, Mobile 4개
      if (width >= 1200) return 10;
      if (width >= 744) return 6;
      return 4;
    }
  }, [type]);

  useEffect(() => {
    // 초기 pageSize 설정
    setPageSize(calculatePageSize());

    // 화면 크기 변경 감지
    const handleResize = () => {
      setPageSize(calculatePageSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculatePageSize]);

  return pageSize;
};