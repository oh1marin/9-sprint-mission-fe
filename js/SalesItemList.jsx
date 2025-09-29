import React, { useState, useEffect, useCallback } from 'react';
import { getProductList } from './ProductService';
import { useResponsive } from '../hooks/useResponsive';

const SalesItemList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [orderBy, setOrderBy] = useState('recent');
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // 커스텀 훅 사용 - 반응형 pageSize 자동 관리
  const pageSize = useResponsive('products');

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

  // pageSize 변경시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // 가격 포맷 함수
  const formatPrice = (price) => {
    if (!price) return '0원';
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 날짜 포맷 함수
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

  // 상품 카드 생성
  const createProductCard = (product) => {
    const imageUrl =
      product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/200x200?text=No+Image';

    return (
      <div key={product.id} className="product-card">
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

  // 페이지네이션
  const renderPagination = () => {
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
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination-btn"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    );
  };

  // 이벤트 핸들러들
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setKeyword(searchInput);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSortChange = (e) => {
    setOrderBy(e.target.value);
    setCurrentPage(1);
  };

  // 상품 목록 렌더링
  const renderProducts = () => {
    if (loading) {
      return <div className="loading">상품을 불러오고 있습니다...</div>;
    }

    if (error) {
      return <div className="error">오류가 발생했습니다: {error}</div>;
    }

    if (products.length === 0) {
      return <div className="no-products">등록된 상품이 없습니다.</div>;
    }

    return (
      <div className="products-grid">
        {products.map((product) => createProductCard(product))}
      </div>
    );
  };

  return (
    <section className="all-products-section">
      <div className="container">
        <div className="products-header">
          <h2 className="section-title">판매 중인 상품</h2>

          <div className="products-controls">
            <div className="search-container">
              <input
                id="search-input"
                className="search-input"
                type="text"
                placeholder="검색할 상품을 입력해주세요"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <button id="search-button" className="search-button" onClick={handleSearch}>
                🔍
              </button>
            </div>

            <select
              id="sort-select"
              className="sort-select"
              value={orderBy}
              onChange={handleSortChange}
              aria-label="정렬 방식 선택"
            >
              <option value="recent">최신 순</option>
              <option value="favorite">좋아요 순</option>
            </select>
          </div>
        </div>

        <div id="all-products-container">
          {renderProducts()}
        </div>

        <div id="pagination-container">
          {renderPagination()}
        </div>
      </div>
    </section>
  );
};

export default SalesItemList;