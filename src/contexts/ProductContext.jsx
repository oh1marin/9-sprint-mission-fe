import { createContext, useState } from 'react';

export const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'recent',
    searchTerm: ''
  });

  const fetchProducts = async (params) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        orderBy: params.orderBy || 'recent',
      });

      if (params.keyword) {
        queryParams.append('keyword', params.keyword);
      }

      const response = await fetch(
        `https://panda-market-api.vercel.app/products?${queryParams}`
      );
      const data = await response.json();
      setProducts(data.list || []);
      return data;
    } catch (error) {
      console.error('상품 로드 실패:', error);
      return { list: [], totalCount: 0 };
    } finally {
      setLoading(false);
    }
  };

  const fetchBestItems = async () => {
    try {
      const response = await fetch(
        'https://panda-market-api.vercel.app/products?orderBy=favorite&pageSize=4'
      );
      const data = await response.json();
      return data.list || [];
    } catch (error) {
      console.error('베스트 상품 로드 실패:', error);
      return [];
    }
  };

  const addProduct = async (productData) => {
    try {
      const response = await fetch('https://panda-market-api.vercel.app/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const newProduct = await response.json();
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (error) {
      console.error('상품 등록 실패:', error);
      throw error;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const value = {
    products,
    loading,
    filters,
    fetchProducts,
    fetchBestItems,
    addProduct,
    updateFilters
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}