const BASE_URL = 'https://panda-market-api-crud.vercel.app';

// GET 메서드로 게시글 목록 조회
export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (pageSize) params.append('pageSize', pageSize);
  if (keyword) params.append('keyword', keyword);
  
  const url = `${BASE_URL}/articles?${params.toString()}`;
  
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('게시글 목록 조회 성공:', data);
      return data;
    })
    .catch(error => {
      console.error('게시글 목록 조회 실패:', error.message);
      throw error;
    });
}

// GET 메서드로 특정 게시글 조회
export function getArticle(id) {
  const url = `${BASE_URL}/articles/${id}`;
  
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('게시글 조회 성공:', data);
      return data;
    })
    .catch(error => {
      console.error('게시글 조회 실패:', error.message);
      throw error;
    });
}

// POST 메서드로 게시글 생성
export function createArticle(title, content, image) {
  const url = `${BASE_URL}/articles`;
  const requestBody = {
    title,
    content,
    image
  };
  
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('게시글 생성 성공:', data);
      return data;
    })
    .catch(error => {
      console.error('게시글 생성 실패:', error.message);
      throw error;
    });
}

// PATCH 메서드로 게시글 수정
export function patchArticle(id, updateData) {
  const url = `${BASE_URL}/articles/${id}`;
  
  return fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('게시글 수정 성공:', data);
      return data;
    })
    .catch(error => {
      console.error('게시글 수정 실패:', error.message);
      throw error;
    });
}

// DELETE 메서드로 게시글 삭제
export function deleteArticle(id) {
  const url = `${BASE_URL}/articles/${id}`;
  
  return fetch(url, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('게시글 삭제 성공:', data);
      return data;
    })
    .catch(error => {
      console.error('게시글 삭제 실패:', error.message);
      throw error;
    });
}