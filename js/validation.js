// API 서버 주소
const BASE_URL = 'https://panda-market-api-crud.vercel.app';

// 상품 목록 가져오기
// page: 몇 페이지를 볼지 (기본값: 1페이지)
// pageSize: 한 페이지에 몇 개씩 보여줄지 (기본값: 10개)
// keyword: 검색어 (비어있으면 전체 조회)
export async function getProductList(page = 1, pageSize = 10, keyword = '') {
  try {
    // URL에 붙일 파라미터 준비
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (keyword) params.append('keyword', keyword);
    
    // 최종 요청 URL 만들기
    const url = `${BASE_URL}/products?${params.toString()}`;
    // 서버에 요청 보내고 응답 기다리기
    const response = await fetch(url);
    
    // 서버 응답이 정상이 아니면 에러 발생
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    // 응답을 JSON 형식으로 변환
    const data = await response.json();
    console.log('상품 목록 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('상품 목록 조회 실패:', error.message);
    throw error;
  }
}

// 특정 상품 하나만 가져오기
// id: 조회할 상품 번호
export async function getProduct(id) {
  try {
    const url = `${BASE_URL}/products/${id}`;
    const response = await fetch(url);
    
    // 서버 응답이 정상이 아니면 에러 발생
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    // 응답을 JSON 형식으로 변환
    const data = await response.json();
    console.log('상품 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('상품 조회 실패:', error.message);
    throw error;
  }
}

// 새 상품 등록하기
// name: 상품명
// description: 상품 설명
// price: 가격
// tags: 태그 목록 (배열)
// images: 이미지 URL 목록 (배열)
export async function createProduct(name, description, price, tags, images) {
  try {
    const url = `${BASE_URL}/products`;
    
    // 서버로 보낼 데이터
    const requestBody = {
      name,
      description,
      price,
      tags,
      images
    };
    
    // 서버에 POST 요청 (새 데이터 생성)
    const response = await fetch(url, {
      method: 'POST',  // 생성은 POST 메서드 사용
      headers: {
        'Content-Type': 'application/json',  // JSON 형식으로 보냄
      },
      body: JSON.stringify(requestBody)  // 객체를 JSON 문자열로 변환
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

// 기존 상품 수정하기
// id: 수정할 상품 번호
// updateData: 수정할 내용 (예: {name: "새 상품명", price: 15000})
export async function patchProduct(id, updateData) {
  try {
    const url = `${BASE_URL}/products/${id}`;
    
    // 서버에 PATCH 요청 (일부 데이터만 수정)
    const response = await fetch(url, {
      method: 'PATCH',  // 수정은 PATCH 메서드 사용
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)  // 수정할 내용을 JSON으로 변환
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

// 상품 삭제하기
// id: 삭제할 상품 번호
export async function deleteProduct(id) {
  try {
    const url = `${BASE_URL}/products/${id}`;
    
    // 서버에 DELETE 요청 (데이터 삭제)
    const response = await fetch(url, {
      method: 'DELETE'  // 삭제는 DELETE 메서드 사용
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