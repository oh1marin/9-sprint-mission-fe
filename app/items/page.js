'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ItemsPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="page-container">

      {}
      <nav className="header-nav">
        <div className="nav-container">
          <Link href="/" className="brand-logo">
            <Image src="/images/pandalogo.png" alt="logo" width={120} height={40} />
          </Link>

          <div className="nav-menu-group">
            <Link href="/board" className="board-link">
              자유게시판
            </Link>
            <Link href="/market" className="market-link">
              중고마켓
            </Link>
          </div>

          <div className="nav-right">
            <Link href="/login" className="login-button">
              로그인
            </Link>
          </div>
        </div>
      </nav>

      {}
      <main className="main-content center-container">
        <div className="w-full max-w-6xl mx-auto px-4 py-10">
          {}
        </div>
      </main>
    </div>
  );
}
