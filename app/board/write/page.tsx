"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WritePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://panda-market-api.vercel.app/articles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
          }),
        }
      );

      if (response.ok) {
        alert("게시글이 등록되었습니다.");
        router.push("/board");
      } else {
        alert("게시글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <header className="header-nav">
        <div className="nav-container">
          <Link href="/" className="brand-logo">
            <Image src="/images/pandalogo.png" alt="" width={200} height={67} />
          </Link>

          <nav className="nav-menu-group">
            <Link href="/board" className="board-link">
              자유게시판
            </Link>
            <Link href="/market" className="market-link">
              중고마켓
            </Link>
          </nav>

          <div className="nav-right">
            <Link href="/login" className="login-button">
              로그인
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="center-container">
          <div
            style={{
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
              padding: "0 20px",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[24px] font-bold text-[#111827]">
                게시글 쓰기
              </h1>
              <button
                onClick={(e) => handleSubmit(e as any)}
                disabled={isSubmitting}
                className="rounded-lg bg-[#3692FF] px-6 py-2.5 text-white font-semibold hover:bg-[#2563eb] disabled:bg-[#9ca3af] disabled:cursor-not-allowed"
              >
                {isSubmitting ? "등록 중..." : "등록"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[14px] font-semibold text-[#111827] mb-2">
                  *제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해주세요"
                  className="w-full rounded-lg border border-[#d1d5db] px-4 py-3 text-[16px] outline-none focus:border-[#3692FF] focus:ring-2 focus:ring-[#3692FF]/20"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#111827] mb-2">
                  *내용
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력해주세요"
                  className="w-full rounded-lg border border-[#d1d5db] px-4 py-3 text-[16px] outline-none focus:border-[#3692FF] focus:ring-2 focus:ring-[#3692FF]/20 min-h-[400px] resize-none"
                />
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-text">©codeit - 2024</div>
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div className="footer-social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-button"
            >
              <Image
                src="/images/facebook.png"
                alt="Facebook"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-button"
            >
              <Image
                src="/images/tw.png"
                alt="Twitter"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-button"
            >
              <Image
                src="/images/youtube.png"
                alt="YouTube"
                width={20}
                height={20}
              />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-button"
            >
              <Image
                src="/images/insta.png"
                alt="Instagram"
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
