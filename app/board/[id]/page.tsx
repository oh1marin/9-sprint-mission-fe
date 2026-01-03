"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  likeCount: number;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
}

interface CommentsResponse {
  list: Comment[];
}

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchPostDetail = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://panda-market-api.vercel.app/articles/${postId}`
      );
      if (response.ok) {
        const data: Post = await response.json();
        setPost(data);
      }
    } catch (error) {
      console.error("게시글 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://panda-market-api.vercel.app/articles/${postId}/comments`
      );
      if (response.ok) {
        const data: CommentsResponse = await response.json();
        setComments(data.list || []);
      }
    } catch (error) {
      console.error("댓글 로드 실패:", error);
    }
  };

  const handleCommentSubmit = async (): Promise<void> => {
    if (!commentInput.trim()) return;

    try {
      const response = await fetch(
        `https://panda-market-api.vercel.app/articles/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: commentInput.trim() }),
        }
      );

      if (response.ok) {
        setCommentInput("");
        fetchComments();
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    }
  };

  const handleCommentEdit = async (commentId: number): Promise<void> => {
    if (!editingContent.trim()) return;

    try {
      const response = await fetch(
        `https://panda-market-api.vercel.app/comments/${commentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editingContent.trim() }),
        }
      );

      if (response.ok) {
        setEditingCommentId(null);
        setEditingContent("");
        fetchComments();
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  const handleCommentDelete = async (commentId: number): Promise<void> => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `https://panda-market-api.vercel.app/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  const handlePostDelete = async (): Promise<void> => {
    if (!confirm("게시글을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `https://panda-market-api.vercel.app/articles/${postId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("게시글이 삭제되었습니다.");
        router.push("/board");
      }
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
    }
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

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className="text-center py-20 text-[#6b7280]">
            게시글을 불러오는 중입니다...
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-container">
        <Header />
        <main className="main-content">
          <div className="text-center py-20 text-[#6b7280]">
            게시글을 찾을 수 없습니다.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />

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
            <Link
              href="/board"
              className="inline-block mb-6 text-[#6b7280] hover:text-[#111827]"
            >
              ← 목록으로
            </Link>

            <article className="bg-white rounded-lg border border-[#e5e7eb] p-6 mb-6">
              <h1 className="text-[28px] font-bold text-[#111827] mb-4">
                {post.title}
              </h1>

              {post.image && (
                <div className="mb-6 w-full max-w-2xl">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full rounded-lg object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e5e7eb]">
                <div className="flex items-center gap-3 text-[14px] text-[#6b7280]">
                  <span>판다마켓</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#6b7280]">
                    🖤 {post.likeCount || 0}
                  </span>
                  <button
                    onClick={handlePostDelete}
                    className="text-[14px] text-[#dc2626] hover:text-[#991b1b] font-medium"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className="text-[16px] text-[#374151] leading-7 whitespace-pre-wrap">
                {post.content}
              </div>
            </article>

            <section className="bg-white rounded-lg border border-[#e5e7eb] p-6">
              <h2 className="text-[18px] font-bold text-[#111827] mb-4">
                댓글 ({comments.length})
              </h2>

              <div className="mb-6">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="댓글을 입력해주세요"
                  className="w-full rounded-lg border border-[#d1d5db] px-4 py-3 text-[14px] outline-none focus:border-[#3692FF] focus:ring-2 focus:ring-[#3692FF]/20 min-h-[100px] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!commentInput.trim()}
                    className="rounded-lg bg-[#3692FF] px-5 py-2 text-white font-semibold disabled:bg-[#d1d5db] disabled:cursor-not-allowed hover:bg-[#3692FF]"
                  >
                    등록
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-t border-[#e5e7eb] pt-4"
                  >
                    {editingCommentId === comment.id ? (
                      <div>
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full rounded-lg border border-[#d1d5db] px-4 py-3 text-[14px] outline-none focus:border-[#3692FF] min-h-[80px] resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingContent("");
                            }}
                            className="rounded-lg border border-[#d1d5db] px-4 py-1.5 text-[14px] text-[#6b7280] hover:bg-[#f9fafb]"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleCommentEdit(comment.id)}
                            className="rounded-lg bg-[#3692FF] px-4 py-1.5 text-[14px] text-white hover:bg-[#2563eb]"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-[14px]">
                            <span className="font-medium text-[#111827]">
                              판다마켓
                            </span>
                            <span className="text-[#9ca3af]">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditingContent(comment.content);
                              }}
                              className="text-[14px] text-[#6b7280] hover:text-[#111827]"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleCommentDelete(comment.id)}
                              className="text-[14px] text-[#dc2626] hover:text-[#991b1b]"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                        <p className="text-[14px] text-[#374151]">
                          {comment.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
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
