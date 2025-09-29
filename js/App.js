import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import MarketPage from './pages/MarketPage';
import RegistrationPage from './pages/RegistrationPage';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="page-container">
        {/* 상단 네비게이션 바 */}
        <Navigation />
        
        {/* 메인 콘텐츠 */}
        <main className="main-content">
          <Routes>
            {/* 랜딩 페이지 - "/" */}
            <Route path="/" element={<LandingPage />} />
            
            {/* 중고마켓 페이지 - "/items" */}
            <Route path="/items" element={<MarketPage />} />
            
            {/* 상품 등록 페이지 - "/registration" */}
            <Route path="/registration" element={<RegistrationPage />} />
            
            {/* 상품 상세 페이지 (빈 페이지) */}
            <Route path="/items/:id" element={<EmptyPage title="상품 상세" />} />
          </Routes>
        </main>
        
        {/* 하단 푸터 */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

// 빈 페이지 컴포넌트
const EmptyPage = ({ title }) => {
  return (
    <div className="empty-page-container">
      <div className="empty-page-content">
        <h1>{title}</h1>
        <p>현재 준비 중인 페이지입니다.</p>
        <a href="/" className="back-to-home-button">홈으로 돌아가기</a>
      </div>
    </div>
  );
};

export default App;