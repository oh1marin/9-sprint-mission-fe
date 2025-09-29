import React from 'react';
import { useNavigate } from 'react-router-dom';
import BestItems from '../components/BestItems';
import SalesItemList from '../components/SalesItemList';

const MarketPage = () => {
  const navigate = useNavigate();

  // 상품 등록 버튼 클릭 핸들러
  const handleRegisterClick = () => {
    navigate('/registration');
  };

  return (
    <div className="market-page">
      {/* 상품 등록 버튼 */}
      <div className="container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '20px',
          paddingTop: '20px'
        }}>
          <button 
            className="register-button"
            onClick={handleRegisterClick}
            style={{
              background: '#3B82F6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#2563EB'}
            onMouseOut={(e) => e.target.style.background = '#3B82F6'}
          >
            상품 등록하기
          </button>
        </div>
      </div>

      {/* 베스트 상품 섹션 */}
      <BestItems />
      
      {/* 전체 상품 섹션 */}
      <SalesItemList />
    </div>
  );
};

export default MarketPage;