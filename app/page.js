'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <>
      <nav className="header-nav">
        <div className="nav-container">
          <Link href="/" className="brand-logo">
            <Image src="/images/pandalogo.png" alt="판다마켓 로고" width={120} height={40} />
          </Link>
          <div className="nav-menu-group">
            <Link href="/board" className="board-link">자유게시판</Link>
            <Link href="/market" className="market-link">중고마켓</Link>
          </div>
          <div className="nav-right">
            <Link href="/login" className="login-button">로그인</Link>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <Link href="/market" className="hero-image-link" aria-label="중고마켓으로 이동">
            <Image src="/images/panda1.png" alt="판다마켓 메인 이미지" width={1200} height={600} priority />
          </Link>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="section-image">
            <Image src="/images/panda2.png" alt="상품 등록 이미지" width={1200} height={600} />
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="section-image">
            <Image src="/images/panda3.png" alt="핫한 상품 이미지" width={1200} height={600} />
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-inner">
          <div className="section-image">
            <Image src="/images/panda4.png" alt="판매 등록 이미지" width={1200} height={600} />
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="hero-content">
          <div className="section-image">
            <Image src="/images/panda5.png" alt="안전거래 이미지" width={1200} height={600} />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-text">©codeit - 2024</div>
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="Facebook">
              <Image src="/images/facebook.png" alt="Facebook" width={20} height={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="Twitter">
              <Image src="/images/tw.png" alt="Twitter" width={20} height={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="YouTube">
              <Image src="/images/youtube.png" alt="YouTube" width={20} height={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-button" title="Instagram">
              <Image src="/images/insta.png" alt="Instagram" width={20} height={20} />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
