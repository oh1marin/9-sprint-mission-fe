"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function FAQPage() {
  return (
    <div className="page-container">
      <Header />

      <main className="main-content empty-page-container">
        <div className="empty-page-content">
          <h1>자주 묻는 질문</h1>
          <p>
            판다마켓 FAQ 페이지입니다.
            <br />
            현재 준비 중인 페이지입니다.
          </p>
          <Link href="/" className="back-to-home-button">
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
