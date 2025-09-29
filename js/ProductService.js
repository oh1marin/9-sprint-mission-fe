const BASE_URL = 'https://panda-market-api-crud.vercel.app';

// async/await으로 상품 목록 조회 (orderBy 파라미터 추가)
export async function getProductList(page = 1, pageSize = 10, keyword = '', orderBy = 'recent') {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (keyword) params.append('keyword', keyword);
    if (orderBy) params.append('orderBy', orderBy);
    
    const url = `${BASE_URL}/products?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('상품 목록 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('상품 목록 조회 실패:', error.message);
    throw error;
  }
}

// async/await으로 특정 상품 조회
export async function getProduct(id) {
  try {
    const url = `${BASE_URL}/products/${id}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('상품 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('상품 조회 실패:', error.message);
    throw error;
  }
}

// async/await으로 상품 생성
export async function createProduct(name, description, price, tags, images) {
  try {
    const url = `${BASE_URL}/products`;
    const requestBody = {
      name,
      description,
      price,
      tags,
      images
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('상품 생성 성공:', data);
    return data;
  } catch (error) {
    console.error('상품 생성 실패:', error.message);
    throw error;
  }
}

// async/await으로 상품 수정
export async function patchProduct(id, updateData) {
  try {
    const url = `${BASE_URL}/products/${id}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('상품 수정 성공:', data);
    return data;
  } catch (error) {
    console.error('상품 수정 실패:', error.message);
    throw error;
  }
}

// async/await으로 상품 삭제
export async function deleteProduct(id) {
  try {
    const url = `${BASE_URL}/products/${id}`;
    
    const response = await fetch(url, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('상품 삭제 성공:', data);
    return data;
  } catch (error) {
    console.error('상품 삭제 실패:', error.message);
    throw error;
  }
}