"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductProvider, useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import defaultImage from "../../public/images/kakao.png";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:4000"
).replace(/\/+$/, "");

export default function MarketPage() {
  return (
    <ProductProvider>
      <MarketInner />
    </ProductProvider>
  );
}

function MarketInner() {
  const { isAuthenticated } = useAuth();
  const {
    products,
    loading,
    filters,
    fetchProducts,
    fetchBestItems,
    updateFilters,
  } = useProducts();
  const [bestItems, setBestItems] = useState([]);
  const [bestLoading, setBestLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  function getPageSize() {
    if (typeof window === "undefined") return 10;
    const width = window.innerWidth;
    if (width >= 1200) return 10;
    if (width >= 744) return 6;
    return 4;
  }

  useEffect(() => {
    setPageSize(getPageSize());
    loadBestProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [currentPage, pageSize, filters]);

  useEffect(() => {
    const handleResize = () => {
      const newPageSize = getPageSize();
      if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
        setCurrentPage(1);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageSize]);

  const loadBestProducts = async () => {
    setBestLoading(true);
    try {
      const items = await fetchBestItems();
      setBestItems(items.slice(0, 4));
    } catch (error) {
      console.error("베스트 상품 로드 실패:", error);
    } finally {
      setBestLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await fetchProducts({
        page: currentPage,
        pageSize,
        orderBy: filters.sortBy,
        keyword: filters.searchTerm,
      });
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error("상품 로드 실패:", error);
    }
  };

  const handleSearch = () => {
    updateFilters({ searchTerm: searchInput });
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSortChange = (e) => {
    updateFilters({ sortBy: e.target.value });
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderProductCard = (product) => {
    let imageUrl =
      product.images && product.images.length > 0
        ? product.images[0]
        : product.item
        ? product.item
        : defaultImage.src;

    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = `${API_BASE}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }

    return (
      <div key={product.id} className="product-card">
        <div className="product-image">
          <img
            src={imageUrl}
            alt={product.name || "상품 이미지"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage.src;
            }}
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name || "제목 없음"}</h3>
          <p className="product-price">{formatPrice(product.price)}</p>
          <div className="product-meta">
            <span className="product-favorite">
              ♥ {product.favoriteCount || 0}
            </span>
            <span className="product-date">
              {formatDate(product.createdAt)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "0원";
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
      return hours < 1 ? "방금 전" : `${hours}시간 전`;
    }
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (totalPages <= 1) return null;
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const visiblePages = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            className={`pagination-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination-btn"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    );
  };

  return (
    <>
      <Header />

      <main className="main-content">
        <section className="best-products-section">
          <div className="container">
            <h2 className="section-title">베스트 상품</h2>
            <div id="best-products-container">
              {bestLoading ? (
                <div className="loading">
                  베스트 상품을 불러오고 있습니다...
                </div>
              ) : (
                <div className="best-products-grid">
                  {bestItems.map((product) => renderProductCard(product))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="all-products-section">
          <div className="container">
            <div className="products-header">
              <h2 className="section-title">판매 중인 상품</h2>
              <div className="products-controls">
                <div className="search-container">
                  <input
                    className="search-input"
                    type="text"
                    placeholder="검색할 상품을 입력해주세요"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                </div>
                <Link href="/registration" className="register-button">
                  + 상품 등록
                </Link>
                <select
                  className="sort-select"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                >
                  <option value="recent">최신 순</option>
                  <option value="favorite">좋아요 순</option>
                </select>
              </div>
            </div>

            <div id="all-products-container">
              {loading ? (
                <div className="loading">상품을 불러오고 있습니다...</div>
              ) : products.length === 0 ? (
                <div className="no-products">등록된 상품이 없습니다.</div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => renderProductCard(product))}
                </div>
              )}
            </div>

            <div id="pagination-container">{renderPagination()}</div>
          </div>
        </section>
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
    </>
  );
}
