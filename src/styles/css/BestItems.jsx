import React, { useState, useEffect } from 'react';
import { getProductList } from './ProductService';
import { useResponsive } from '../hooks/useResponsive';

const BestItems = () => {
  const [bestProducts, setBestProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 커스텀 훅 사용 - 반응형 pageSize 자동 관리
  const pageSize = useResponsive('best');

  // 베스트 상품 로드 (pageSize 변경시 자동 재로드)
  useEffect(() => {
    const loadBestProducts = async () => {
      setLoading(true);

      try {
        const data = await getProductList(1, pageSize, '', 'favorite');
        setBestProducts(data.list || []);
      } catch (err) {
        console.error('베스트 상품 조회 실패:', err);
        setBestProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBestProducts();
  }, [pageSize]);

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

  // 베스트 상품 렌더링
  const renderBestProducts = () => {
    if (loading) {
      return <div className="loading">베스트 상품을 불러오고 있습니다...</div>;
    }

    return (
      <div className="best-products-grid">
        {bestProducts.map((product) => createProductCard(product))}
      </div>
    );
  };

  return (
    <section className="best-products-section">
      <div className="container">
        <h2 className="section-title">베스트 상품</h2>
        <div id="best-products-container">
          {renderBestProducts()}
        </div>
      </div>
    </section>
  );
};

export default BestItems;