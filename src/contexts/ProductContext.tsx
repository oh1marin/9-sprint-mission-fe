"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  tags: string[];
  favoriteCount: number;
  createdAt: string;
  ownerId: number | null;
  ownerNickname: string | null;
}

interface Comment {
  id: number;
  content: string;
  writer: {
    id: number;
    nickname: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface FetchProductsParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  keyword?: string;
}

interface FetchProductsResponse {
  totalCount: number;
  list: Product[];
}

interface FetchCommentsParams {
  cursor?: string | null;
  limit?: number;
}

interface FetchCommentsResponse {
  list: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  tags?: string[];
  images?: string[];
}

interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
}

interface CreateCommentPayload {
  content: string;
}

interface UpdateCommentPayload {
  content: string;
}

interface Filters {
  sortBy: string;
  searchTerm: string;
}

interface ProductContextValue {
  products: Product[];
  loading: boolean;
  filters: Filters;
  fetchProducts: (
    params?: FetchProductsParams
  ) => Promise<FetchProductsResponse>;
  fetchBestItems: () => Promise<Product[]>;
  fetchProductDetail: (productId: number | string) => Promise<Product>;
  fetchProductComments: (
    productId: number | string,
    params?: FetchCommentsParams
  ) => Promise<FetchCommentsResponse>;
  createProduct: (payload: CreateProductPayload) => Promise<Product>;
  updateProduct: (
    productId: number | string,
    payload: UpdateProductPayload
  ) => Promise<Product>;
  deleteProduct: (productId: number | string) => Promise<boolean>;
  createProductComment: (
    productId: number | string,
    payload: CreateCommentPayload
  ) => Promise<Comment>;
  updateComment: (
    commentId: number | string,
    payload: UpdateCommentPayload
  ) => Promise<Comment>;
  deleteComment: (commentId: number | string) => Promise<boolean>;
  updateFilters: (partial: Partial<Filters>) => void;
}

const ProductContext = createContext<ProductContextValue | null>(null);

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE || "https://panda-market-api.vercel.app"
).replace(/\/+$/, "");

function makeUrl(
  path: string,
  params?: Record<string, string | number | undefined>
): string {
  const u = new URL(
    path.startsWith("/") ? API_BASE + path : API_BASE + "/" + path
  );
  if (params)
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "")
        u.searchParams.set(k, String(v));
    });
  return u.toString();
}

function pickArray(x: any): any[] {
  if (Array.isArray(x)) return x;
  if (x && Array.isArray(x.list)) return x.list;
  return [];
}

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    sortBy: "recent",
    searchTerm: "",
  });

  async function fetchProducts({
    page = 1,
    pageSize = 10,
    orderBy = "recent",
    keyword = "",
  }: FetchProductsParams = {}): Promise<FetchProductsResponse> {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        pageSize,
        orderBy,
      };
      if (keyword) params.keyword = keyword;

      const url = makeUrl("/products", params);
      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        console.error("API 에러:", res.status);
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("API 응답:", data);

      const items = pickArray(data);
      setProducts(items);

      return {
        totalCount: data.totalCount || items.length,
        list: items,
      };
    } catch (error) {
      console.error("fetchProducts 에러:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function fetchBestItems(): Promise<Product[]> {
    try {
      const url = makeUrl("/products", { orderBy: "favorite", pageSize: 20 });
      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        console.error("베스트 상품 API 에러:", res.status);
        return [];
      }

      const data = await res.json();
      console.log("베스트 상품 응답:", data);

      return pickArray(data);
    } catch (error) {
      console.error("fetchBestItems 에러:", error);
      return [];
    }
  }

  async function fetchProductDetail(
    productId: number | string
  ): Promise<Product> {
    const res = await fetch(makeUrl(`/products/${productId}`), {
      method: "GET",
      cache: "no-store",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function fetchProductComments(
    productId: number | string,
    { cursor: cur, limit }: FetchCommentsParams = {}
  ): Promise<FetchCommentsResponse> {
    const res = await fetch(
      makeUrl(`/products/${productId}/comments`, {
        cursor: cur || undefined,
        limit: limit || undefined,
      }),
      { method: "GET", cache: "no-store", headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      list: pickArray(data),
      nextCursor: data?.nextCursor ?? null,
      hasMore: Boolean(data?.hasMore),
    };
  }

  async function createProduct(
    payload: CreateProductPayload
  ): Promise<Product> {
    const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
    const res = await fetch(makeUrl("/products"), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function updateProduct(
    productId: number | string,
    payload: UpdateProductPayload
  ): Promise<Product> {
    const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
    const res = await fetch(makeUrl(`/products/${productId}`), {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function deleteProduct(productId: number | string): Promise<boolean> {
    const res = await fetch(makeUrl(`/products/${productId}`), {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  }

  async function createProductComment(
    productId: number | string,
    payload: CreateCommentPayload
  ): Promise<Comment> {
    const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
    const res = await fetch(makeUrl(`/products/${productId}/comments`), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function updateComment(
    commentId: number | string,
    payload: UpdateCommentPayload
  ): Promise<Comment> {
    const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
    const res = await fetch(makeUrl(`/comments/${commentId}`), {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function deleteComment(commentId: number | string): Promise<boolean> {
    const res = await fetch(makeUrl(`/comments/${commentId}`), {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  }

  function updateFilters(partial: Partial<Filters>): void {
    setFilters((p) => ({ ...p, ...partial }));
  }

  const value = useMemo<ProductContextValue>(
    () => ({
      products,
      loading,
      filters,
      fetchProducts,
      fetchBestItems,
      fetchProductDetail,
      fetchProductComments,
      createProduct,
      updateProduct,
      deleteProduct,
      createProductComment,
      updateComment,
      deleteComment,
      updateFilters,
    }),
    [products, loading, filters]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProducts(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
