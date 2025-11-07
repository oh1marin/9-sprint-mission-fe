'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <div className="page-container">
      <nav className="header-nav">
        <div className="nav-container">
          <Link href="/" className="brand-logo">
            <Image src="/images/pandalogo.png" alt="판다마켓 로고" width={120} height={40} />
          </Link>
          <Link href="/login" className="login-button">로그인</Link>
        </div>
      </nav>

      <main className="main-content empty-page-container">
        <div className="empty-page-content">
          <h1>개인정보처리방침</h1>
          <p>판다마켓의 개인정보처리방침 페이지입니다.<br />현재 준비 중인 페이지입니다.</p>
          <Link href="/" className="back-to-home-button">홈으로 돌아가기</Link>
        </div>
      </main>
    </div>
  );
}