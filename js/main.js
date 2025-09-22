/**
 * API 테스트 및 초기화 스크립트
 */

// 상수 정의
const TEST_CONFIG = {
  // API 테스트 간 대기 시간 (밀리초)
  // 서버 부하 방지 및 API Rate Limit 회피를 위한 지연
  API_TEST_DELAY: 1000,
  
  // 재시도 횟수
  MAX_RETRIES: 3,
  
  // 타임아웃 시간
  REQUEST_TIMEOUT: 5000
};

/**
 * 지연 함수 - Promise 기반
 * @param {number} ms - 대기할 밀리초
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Article API 테스트
 */
async function testArticleAPI() {
  try {
    console.log('📝 Article API 테스트 시작...');
    
    // 실제 API 테스트 로직
    const response = await fetch('https://panda-market-api.vercel.app/articles?page=1&pageSize=5');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Article API 테스트 성공:', data);
    
  } catch (error) {
    console.error('❌ Article API 테스트 실패:', error.message);
  }
}

/**
 * Product API 테스트
 */
async function testProductAPI() {
  try {
    console.log('🛍️ Product API 테스트 시작...');
    
    const response = await fetch('https://panda-market-api.vercel.app/products?page=1&pageSize=5');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Product API 테스트 성공:', data);
    
  } catch (error) {
    console.error('❌ Product API 테스트 실패:', error.message);
  }
}

/**
 * API 테스트 시퀀스 실행
 * 각 API 테스트 사이에 지연을 두어 서버 부하를 방지
 */
async function runAPITests() {
  console.log('🚀 API 테스트 시퀀스 시작');
  
  // Article API 테스트
  await testArticleAPI();
  
  // 서버 부하 방지를 위한 지연
  // Rate Limit 회피 및 로그 가독성 향상
  console.log(`⏳ ${TEST_CONFIG.API_TEST_DELAY}ms 대기 중...`);
  await delay(TEST_CONFIG.API_TEST_DELAY);
  
  // Product API 테스트
  await testProductAPI();
  
  console.log('✨ 모든 API 테스트 완료');
}

/**
 * 페이지 초기화
 */
function initializePage() {
  console.log('🔄 페이지 초기화 중...');
  
  // 여기에 다른 초기화 로직 추가 가능
  // 예: 이벤트 리스너 등록, 초기 데이터 로드 등
  
  console.log('✅ 페이지 초기화 완료');
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    // 페이지 초기화
    initializePage();
    
    // API 테스트 실행 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
      await runAPITests();
    }
    
  } catch (error) {
    console.error('💥 메인 실행 중 오류 발생:', error);
  }
}

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', main);