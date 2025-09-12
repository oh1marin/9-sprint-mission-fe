// import를 사용하여 함수들 가져오기
import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle
} from './ArticleService.js';

import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct
} from './ProductService.js';

// Article API 함수들 테스트
async function testArticleAPI() {
  console.log('=== Article API 테스트 시작 ===');
  
  try {
    // 1. 게시글 목록 조회 테스트
    console.log('\n1. 게시글 목록 조회:');
    await getArticleList(1, 5, 'test');
    
    // 2. 게시글 생성 테스트
    console.log('\n2. 게시글 생성:');
    const newArticle = await createArticle(
      '테스트 게시글 제목',
      '테스트 게시글 내용입니다.',
      'https://example.com/image.jpg'
    );
    
    if (newArticle && newArticle.id) {
      // 3. 특정 게시글 조회 테스트
      console.log('\n3. 특정 게시글 조회:');
      await getArticle(newArticle.id);
      
      // 4. 게시글 수정 테스트
      console.log('\n4. 게시글 수정:');
      await patchArticle(newArticle.id, {
        title: '수정된 게시글 제목',
        content: '수정된 게시글 내용입니다.'
      });
      
      // 5. 게시글 삭제 테스트
      console.log('\n5. 게시글 삭제:');
      await deleteArticle(newArticle.id);
    }
    
  } catch (error) {
    console.error('Article API 테스트 중 오류:', error);
  }
  
  console.log('=== Article API 테스트 완료 ===\n');
}

// Product API 함수들 테스트
async function testProductAPI() {
  console.log('=== Product API 테스트 시작 ===');
  
  try {
    // 1. 상품 목록 조회 테스트
    console.log('\n1. 상품 목록 조회:');
    await getProductList(1, 5, 'phone');
    
    // 2. 상품 생성 테스트
    console.log('\n2. 상품 생성:');
    const newProduct = await createProduct(
      '테스트 상품',
      '테스트 상품 설명입니다.',
      50000,
      ['전자제품', '테스트'],
      ['https://example.com/product1.jpg', 'https://example.com/product2.jpg']
    );
    
    if (newProduct && newProduct.id) {
      // 3. 특정 상품 조회 테스트
      console.log('\n3. 특정 상품 조회:');
      await getProduct(newProduct.id);
      
      // 4. 상품 수정 테스트
      console.log('\n4. 상품 수정:');
      await patchProduct(newProduct.id, {
        name: '수정된 상품명',
        price: 60000
      });
      
      // 5. 상품 삭제 테스트
      console.log('\n5. 상품 삭제:');
      await deleteProduct(newProduct.id);
    }
    
  } catch (error) {
    console.error('Product API 테스트 중 오류:', error);
  }
  
  console.log('=== Product API 테스트 완료 ===');
}

// 모든 API 함수들을 순차적으로 실행
async function runAllTests() {
  console.log('🚀 API 함수 테스트를 시작합니다...\n');
  
  // Article API 테스트 실행
  await testArticleAPI();
  
  // 잠시 대기 후 Product API 테스트 실행
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Product API 테스트 실행
  await testProductAPI();
  
  console.log('\n✅ 모든 API 테스트가 완료되었습니다!');
}

// 프로그램 실행
runAllTests();