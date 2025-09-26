import React, { useState, useEffect, useCallback } from 'react';
import { getProductList } from './ProductService';

const SalesItemList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState('recent');
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

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

  // ItemCard 컴포넌트를 SalesItemList 안에 포함
  const ItemCard = ({ product }) => {
    const imageUrl =
      product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/200x200?text=No+Image';

    return (
      <div className="product-card">
        <div className="product-image">
          <img src={imageUrl} alt={product.name || '상품 이미지'} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name || '제목 없음'}</h3>
          <p className="product-price">{product.price}</p>
          <div className="product-meta">
            <span className="product-favorite">♥ {product.favoriteCount || 0}</span>
            <span className="product-date">{product.createdAt}</span>
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

  const handleSearch = () => {
    setKeyword(searchInput);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
        {products.map((product) => (
          <ItemCard key={product.id} product={product} />
        ))}
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
                className="search-input"
                type="text"
                placeholder="검색할 상품을 입력해주세요"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <button className="search-button" onClick={handleSearch}>
                🔍
              </button>
            </div>
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

export default SalesItemList;