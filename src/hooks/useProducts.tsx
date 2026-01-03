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

interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  tags?: string[];
  images?: File[];
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
    productId: number | string
  ) => Promise<{ list: Comment[] }>;
  addProduct: (payload: CreateProductPayload) => Promise<Product>;
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
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

function makeUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  const url = new URL(
    path.startsWith("/") ? API_BASE + path : API_BASE + "/" + path
  );
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.set(key, String(val));
      }
    });
  }
  return url.toString();
}

function pickArray(x: any): any[] {
  if (Array.isArray(x)) return x;
  if (x?.list && Array.isArray(x.list)) return x.list;
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
      console.log("[useProducts] GET", url);

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const list = pickArray(data);

      setProducts(list);

      return {
        totalCount: data.totalCount ?? list.length,
        list,
      };
    } finally {
      setLoading(false);
    }
  }

  async function fetchBestItems(): Promise<Product[]> {
    try {
      const url = makeUrl("/products/best", { limit: 20 });

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) return [];

      const data = await res.json();
      return pickArray(data).slice(0, 20);
    } catch {
      return [];
    }
  }

  async function fetchProductDetail(
    productId: number | string
  ): Promise<Product> {
    const url = makeUrl(`/products/${productId}`);
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function fetchProductComments(
    productId: number | string
  ): Promise<{ list: Comment[] }> {
    const url = makeUrl(`/products/${productId}/comments`);
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function createProduct({
    name,
    description,
    price,
    tags,
    images,
  }: CreateProductPayload): Promise<Product> {
    const url = makeUrl("/products");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description ?? "");
    formData.append("price", String(price));

    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        if (tag) formData.append("tags", tag);
      });
    }

    if (Array.isArray(images)) {
      images.forEach((file) => {
        if (file) formData.append("images", file);
      });
    }

    const headers = getAuthHeaders();

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      let text = "";
      try {
        text = await res.text();
      } catch (e) {}
      console.error("[useProducts] createProduct error response:", text);
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  }

  async function updateProduct(
    productId: number | string,
    payload: UpdateProductPayload
  ): Promise<Product> {
    const url = makeUrl(`/products/${productId}`);
    const res = await fetch(url, {
      method: "PATCH",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
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
    const res = await fetch(makeUrl(`/products/${productId}/comments`), {
      method: "POST",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function updateComment(
    commentId: number | string,
    payload: UpdateCommentPayload
  ): Promise<Comment> {
    const res = await fetch(makeUrl(`/comments/${commentId}`), {
      method: "PATCH",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
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
    setFilters((prev) => ({ ...prev, ...partial }));
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
      addProduct: createProduct,
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
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
}
