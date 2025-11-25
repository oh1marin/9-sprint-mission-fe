'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const ProductContext = createContext(null);

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'https://panda-market-api.vercel.app').replace(/\/+$/,'');

function makeUrl(path, params) {
  const u = new URL(path.startsWith('/') ? API_BASE + path : API_BASE + '/' + path);
  if (params) Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, String(v));
  });
  return u.toString();
}

function pickArray(x) {
  if (Array.isArray(x)) return x;
  if (x && Array.isArray(x.list)) return x.list;
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
  const [filters, setFilters] = useState({ sortBy: 'recent', searchTerm: '' });

  async function fetchProducts({ page = 1, pageSize = 10, orderBy = 'recent', keyword = '' } = {}) {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
        orderBy,
      };
      if (keyword) params.keyword = keyword;

      const url = makeUrl('/products', params);
      const res = await fetch(url, { method: 'GET', cache: 'no-store', headers: getAuthHeaders() });
      
      if (!res.ok) {
        console.error('API 에러:', res.status);
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log('API 응답:', data);
      
      const items = pickArray(data);
      setProducts(items);
      
      return { 
        totalCount: data.totalCount || items.length,
        list: items 
      };
    } catch (error) {
      console.error('fetchProducts 에러:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function fetchBestItems() {
    try {
      const url = makeUrl('/products', { orderBy: 'favorite', pageSize: 20 });
      const res = await fetch(url, { method: 'GET', cache: 'no-store', headers: getAuthHeaders() });
      
      if (!res.ok) {
        console.error('베스트 상품 API 에러:', res.status);
        return [];
      }
      
      const data = await res.json();
      console.log('베스트 상품 응답:', data);
      
      return pickArray(data);
    } catch (error) {
      console.error('fetchBestItems 에러:', error);
      return [];
    }
  }

  async function fetchProductDetail(productId) {
    const res = await fetch(makeUrl(`/products/${productId}`), { 
      method: 'GET', 
      cache: 'no-store', 
      headers: getAuthHeaders() 
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function fetchProductComments(productId, { cursor: cur, limit } = {}) {
    const res = await fetch(
      makeUrl(`/products/${productId}/comments`, { cursor: cur || undefined, limit: limit || undefined }), 
      { method: 'GET', cache: 'no-store', headers: getAuthHeaders() }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { list: pickArray(data), nextCursor: data?.nextCursor ?? null, hasMore: Boolean(data?.hasMore) };
  }

  async function createProduct(payload) {
    const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
    const res = await fetch(makeUrl('/products'), { 
      method: 'POST', 
      headers, 
      body: JSON.stringify(payload) 
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function updateProduct(productId, payload) {
    const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
    const res = await fetch(makeUrl(`/products/${productId}`), { 
      method: 'PATCH', 
      headers, 
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
    const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
    const res = await fetch(makeUrl(`/products/${productId}/comments`), { 
      method: 'POST', 
      headers, 
      body: JSON.stringify(payload) 
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  async function updateComment(commentId, payload) {
    const headers = { ...getAuthHeaders(), 'Content-Type': 'application/json' };
    const res = await fetch(makeUrl(`/comments/${commentId}`), { 
      method: 'PATCH', 
      headers, 
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
    setFilters((p) => ({ ...p, ...partial })); 
  }

  const value = useMemo(() => ({
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
    updateFilters
  }), [products, loading, filters]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}