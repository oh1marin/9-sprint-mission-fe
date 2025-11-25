'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const ProductContext = createContext(null);

const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:4000'
).replace(/\/+$/, '');

function makeUrl(path, params) {
  const url = new URL(path.startsWith('/') ? API_BASE + path : API_BASE + '/' + path);
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.set(key, String(val));
      }
    });
  }
  return url.toString();
}

function pickArray(x) {
  if (Array.isArray(x)) return x;
  if (x?.list && Array.isArray(x.list)) return x.list;
  return [];
}

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'recent',
    searchTerm: ''
  });

  async function fetchProducts({ page = 1, pageSize = 10, orderBy = 'recent', keyword = '' } = {}) {
    setLoading(true);
    try {
      const params = { page, pageSize, orderBy };
      if (keyword) params.keyword = keyword;

      const url = makeUrl('/products', params);

      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store'
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const list = pickArray(data);

      setProducts(list);

      return {
        totalCount: data.totalCount ?? list.length,
        list
      };
    } finally {
      setLoading(false);
    }
  }

  async function fetchBestItems() {
    try {
      const url = makeUrl('/products/best', { limit: 20 });

      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store'
      });

      if (!res.ok) return [];

      const data = await res.json();
      return pickArray(data).slice(0, 20);
    } catch {
      return [];
    }
  }

  async function fetchProductDetail(productId) {
    const url = makeUrl(`/products/${productId}`);
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function fetchProductComments(productId) {
    const url = makeUrl(`/products/${productId}/comments`);
    const res = await fetch(url, { method: 'GET', cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function createProduct(payload) {
    const url = makeUrl('/products');
    const res = await fetch(url, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function updateProduct(productId, payload) {
    const url = makeUrl(`/products/${productId}`);
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function deleteProduct(productId) {
    const res = await fetch(makeUrl(`/products/${productId}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  }

  async function createProductComment(productId, payload) {
    const res = await fetch(makeUrl(`/products/${productId}/comments`), {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function updateComment(commentId, payload) {
    const res = await fetch(makeUrl(`/comments/${commentId}`), {
      method: 'PATCH',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function deleteComment(commentId) {
    const res = await fetch(makeUrl(`/comments/${commentId}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  }

  function updateFilters(partial) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  const value = useMemo(
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
      updateFilters
    }),
    [products, loading, filters]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts <ProductProvider> 안에서만 사용.');
  }
  return context;
}
