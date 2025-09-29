// .env 대신 직접 설정 (임시)
process.env.MONGODB_URI = 'mongodb+srv://marin:marin123@cluster0.obnttz8.mongodb.net/market?retryWrites=true&w=majority';
process.env.PORT = '5000';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 나머지 코드는 그대로...

const app = express();
const PORT = process.env.PORT || 5000;

// CORS 설정
app.use(cors());
app.use(express.json());

// MongoDB 연결
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB 연결 성공'))
    .catch(err => console.error('❌ MongoDB 연결 실패:', err));
} else {
  console.log('⚠️ MONGODB_URI가 설정되지 않았습니다');
}

// 테스트 API
app.get('/', (req, res) => {
  res.json({ message: '중고마켓 API 서버 작동 중!' });
});

app.get('/api/products', (req, res) => {
  res.json({ message: '상품 목록', products: [] });
});

// 서버 시작
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log('='.repeat(50));
});