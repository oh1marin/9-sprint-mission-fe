"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <nav className="header-nav">
      <div className="nav-container">
        <Link href="/" className="brand-logo">
          <Image
            src="/images/pandalogo.png"
            alt="logo"
            width={120}
            height={40}
          />
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
          {user ? (
            <button onClick={logout} className="login-button">
              로그아웃
            </button>
          ) : (
            <Link href="/login" className="login-button">
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
