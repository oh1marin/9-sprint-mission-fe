// API 서버 주소
const BASE_URL = 'https://panda-market-api-crud.vercel.app';

// 게시글 목록 가져오기
// page: 몇 페이지를 볼지 (기본값: 1페이지)
// pageSize: 한 페이지에 몇 개씩 보여줄지 (기본값: 10개)
// keyword: 검색어 (비어있으면 전체 조회)
export function getArticleList(page = 1, pageSize = 10, keyword = '') {
  // URL에 붙일 파라미터 준비
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (pageSize) params.append('pageSize', pageSize);
  if (keyword) params.append('keyword', keyword);
  
  // 최종 요청 URL 만들기
  const url = `${BASE_URL}/articles?${params.toString()}`;
  
  // 서버에 요청 보내기
  return fetch(url)
    .then(response => {
      // 서버 응답이 정상이 아니면 에러 발생
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
      // JSON 형식으로 변환
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

// 특정 게시글 하나만 가져오기
// id: 조회할 게시글 번호
export function getArticle(id) {
  const url = `${BASE_URL}/articles/${id}`;
  
  return fetch(url)
    .then(response => {
      // 서버 응답이 정상이 아니면 에러 발생
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
      // JSON 형식으로 변환
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

// 새 게시글 작성하기
// title: 게시글 제목
// content: 게시글 내용
// image: 이미지 URL (선택사항)
export function createArticle(title, content, image) {
  const url = `${BASE_URL}/articles`;
  
  // 서버로 보낼 데이터
  const requestBody = {
    title,
    content,
    image
  };
  
  return fetch(url, {
    method: 'POST',  // 생성은 POST 메서드 사용
    headers: {
      'Content-Type': 'application/json',  // JSON 형식으로 보냄
    },
    body: JSON.stringify(requestBody)  // 객체를 JSON 문자열로 변환
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

// 기존 게시글 수정하기
// id: 수정할 게시글 번호
// updateData: 수정할 내용 (예: {title: "새 제목", content: "새 내용"})
export function patchArticle(id, updateData) {
  const url = `${BASE_URL}/articles/${id}`;
  
  return fetch(url, {
    method: 'PATCH',  // 수정은 PATCH 메서드 사용
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)  // 수정할 내용을 JSON으로 변환
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

// 게시글 삭제하기
// id: 삭제할 게시글 번호
export function deleteArticle(id) {
  const url = `${BASE_URL}/articles/${id}`;
  
  return fetch(url, {
    method: 'DELETE'  // 삭제는 DELETE 메서드 사용
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