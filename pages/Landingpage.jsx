import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* 메인 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-content">
          <Link to="/items" className="hero-image-link" aria-label="중고마켓으로 이동">
            <img src="/images/panda1.png" alt="판다마켓 메인 이미지" />
          </Link>
        </div>
      </section>

      {/* 상품 등록 섹션 */}
      <section className="content-section">
        <div className="section-inner">
          <div className="section-image">
            <img src="/images/panda2.png" alt="상품 등록 이미지" />
          </div>
        </div>
      </section>

      {/* 핫한 상품 섹션 */}
      <section className="content-section">
        <div className="section-inner">
          <div className="section-image">
            <img src="/images/panda3.png" alt="핫한 상품 이미지" />
          </div>
        </div>
      </section>

      {/* 판매 등록 섹션 */}
      <section className="content-section">
        <div className="section-inner">
          <div className="section-image">
            <img src="/images/panda4.png" alt="판매 등록 이미지" />
          </div>
        </div>
      </section>

      {/* 안전 거래 섹션 */}
      <section className="trust-section">
        <div className="hero-content">
          <div className="section-image">
            <img src="/images/panda5.png" alt="안전거래 이미지" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;