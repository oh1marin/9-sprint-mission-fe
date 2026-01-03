"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

// 타입 정의
interface Post {
  id: number;
  title: string;
  content?: string;
  image?: string;
  likeCount: number;
  createdAt: string;
}

interface PostsResponse {
  list: Post[];
}

export default function BoardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [bestPosts, setBestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderBy, setOrderBy] = useState<string>("recent");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const fetchBestPosts = async (): Promise<void> => {
      try {
        const response = await fetch(
          "https://panda-market-api.vercel.app/articles?orderBy=like&pageSize=3"
        );
        const data: PostsResponse = await response.json();
        setBestPosts(data.list || []);
      } catch (error) {
        console.error("베스트 게시글 로드 실패:", error);
      }
    };

    fetchBestPosts();
  }, []);

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      setLoading(true);
      try {
        let url = `https://panda-market-api.vercel.app/articles?orderBy=${orderBy}&pageSize=10`;

        if (searchKeyword) {
          url += `&keyword=${encodeURIComponent(searchKeyword)}`;
        }

        const response = await fetch(url);
        const data: PostsResponse = await response.json();
        setPosts(data.list || []);
      } catch (error) {
        console.error("게시글 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [orderBy, searchKeyword]);

  const handleSearch = (): void => {
    setSearchKeyword(inputValue);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setOrderBy(e.target.value);
  };

  const handlePostClick = (postId: number): void => {
    router.push(`/board/${postId}`);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ". ");
  };

  return (
    <div className="page-container">
      <Header />

      <main className="main-content">
        <div className="center-container">
          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 20px",
            }}
          >
            <section
              style={{
                maxWidth: "1000px",
                margin: "0 auto",
                marginBottom: "60px",
              }}
            >
              <h2 className="text-[20px] font-bold text-[#111827] mb-6">
                베스트 게시글
              </h2>

              {bestPosts.length === 0 ? (
                <div className="text-center py-10 text-[#9ca3af]">
                  베스트 게시글을 불러오는 중입니다...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bestPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-[#e5e7eb] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handlePostClick(post.id)}
                    >
                      <div className="bg-[#3692FF] text-white text-[12px] px-3 py-1 rounded-full inline-block mb-3">
                        ⭐ Best
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-[16px] mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                        </div>

                        <div className="w-16 h-16 bg-[#e5e7eb] rounded-lg overflow-hidden flex-shrink-0">
                          {post.image && (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              style={{ display: "block" }}
                              onError={(
                                e: React.SyntheticEvent<HTMLImageElement>
                              ) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[12px] text-[#9ca3af] mt-4">
                        <span>판다마켓</span>
                        <div className="flex items-center gap-2">
                          <span>🖤 {post.likeCount || 0}+</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-bold text-[#111827]">
                    게시글
                  </h2>

                  <Link href="/board/write">
                    <button className="rounded-lg bg-[#3692FF] px-5 py-2.5 text-white font-semibold whitespace-nowrap hover:bg-[#2563eb]">
                      + 글쓰기
                    </button>
                  </Link>
                </div>

                <div className="flex items-center justify-between mb-6 gap-3">
                  <input
                    className="flex-1 rounded-lg border border-[#d1d5db] px-4 py-2.5 text-[14px] outline-none"
                    type="text"
                    placeholder="검색할 게시글을 입력해주세요"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />

                  <select
                    className="rounded-lg border border-[#d1d5db] px-4 py-2.5 text-[14px]"
                    value={orderBy}
                    onChange={handleSortChange}
                  >
                    <option value="recent">최신순</option>
                    <option value="like">좋아요순</option>
                  </select>
                </div>

                {loading ? (
                  <div className="text-center py-16 text-[#6b7280]">
                    게시글을 불러오는 중입니다...
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-16 text-[#6b7280]">
                    등록된 게시글이 없습니다.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="border-b border-[#e5e7eb] pb-4 flex items-center justify-between hover:bg-[#f9fafb] p-3 rounded-lg transition-colors cursor-pointer"
                        onClick={() => handlePostClick(post.id)}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-[16px] mb-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-3 text-[14px] text-[#9ca3af]">
                            <span>판다마켓</span>
                            <span>{formatDate(post.createdAt)}</span>
                            <span>🖤 {post.likeCount || 0}+</span>
                          </div>
                        </div>
                        <div className="w-16 h-16 bg-[#e5e7eb] rounded-lg flex-shrink-0 ml-4 overflow-hidden">
                          {post.image && (
                            <img
                              src={post.image}
                              alt=""
                              className="w-full h-full object-cover"
                              style={{ display: "block" }}
                              onError={(
                                e: React.SyntheticEvent<HTMLImageElement>
                              ) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
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
              title="Facebook"
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
              title="Twitter"
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
              title="YouTube"
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
              title="Instagram"
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
