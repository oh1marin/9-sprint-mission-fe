"use client";
import Link from "next/link";
import React, { useContext } from "react";
import Image from "next/image";
import { AuthContext } from "@/contexts/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

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
