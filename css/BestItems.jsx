import React, { useState, useEffect, useCallback } from 'react';
import { getProductList } from './ProductService';

const BestItems = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState('favorite'); // 베스트는 좋아요순 기본
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 화면 크기에 따른 페이지 사이즈 계산
  const getPageSize = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1200) return 8;   // PC: 4열 x 2행 (베스트는 적게)
    if (width >= 744) return 6;    // 태블릿: 3열 x 2행
    return 4;                      // 모바일: 2열 x 2행
  }, []);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      const newPageSize = getPageSize();
      if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
        setCurrentPage(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pageSize, getPageSize]);

  // 초기 페이지 사이즈 설정
  useEffect(() => {
    setPageSize(getPageSize());
  }, [getPageSize]);

  // 상품 목록 로드
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProductList(currentPage, pageSize, keyword, orderBy);
      setProducts(data.list || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, keyword, orderBy]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // 유틸리티 함수들
  const formatPrice = (price) => {
    if (!price) return '0원';
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return hours < 1 ? '방금 전' : `${hours}시간 전`;
    }
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  // 베스트 아이템 카드 (랭킹 포함)
  const BestItemCard = ({ product, rank }) => {
    const imageUrl =
      product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/200x200?text=Best+Item';

    return (
      <div className="product-card" style={{ position: 'relative' }}>
        {/* 랭킹 배지 */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          background: '#ef4444',
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '700',
          zIndex: 1
        }}>
          {rank}
        </div>
        <div className="product-image">
          <img src={imageUrl} alt={product.name || '상품 이미지'} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name || '제목 없음'}</h3>
          <p className="product-price">{formatPrice(product.price)}</p>
          <div className="product-meta">
            <span className="product-favorite">♥ {product.favoriteCount || 0}</span>
            <span className="product-date">{formatDate(product.createdAt)}</span>
          </div>
        </div>
      </div>
    );
  };

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    const totalPages = Math.ceil(totalCount / pageSize);

    if (totalPages <= 1) return null;

    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    );
  };

  // 이벤트 핸들러들
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (e) => {
    setOrderBy(e.target.value);
    setCurrentPage(1);
  };

  // 상품 목록 렌더링
  const renderProducts = () => {
    if (loading) {
      return <div className="loading">베스트 상품을 불러오고 있습니다...</div>;
    }

    if (error) {
      return <div className="error">오류가 발생했습니다: {error}</div>;
    }

    if (products.length === 0) {
      return <div className="no-products">베스트 상품이 없습니다.</div>;
    }

    return (
      <div className="best-products-grid">
        {products.map((product, index) => (
          <BestItemCard 
            key={product.id} 
            product={product} 
            rank={(currentPage - 1) * pageSize + index + 1}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="best-products-section">
      <div className="container">
        <div className="products-header">
          <h2 className="section-title">🏆 베스트 상품</h2>

          <div className="products-controls">
            <select
              className="sort-select"
              value={orderBy}
              onChange={handleSortChange}
              aria-label="정렬 방식 선택"
            >
              <option value="favorite">좋아요 순</option>
              <option value="recent">최신 순</option>
            </select>
          </div>
        </div>

        <div>
          {renderProducts()}
        </div>

        <div>
          <Pagination />
        </div>
      </div>
    </section>
  );
};

export default BestItems;