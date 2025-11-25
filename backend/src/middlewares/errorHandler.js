export function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  if (res.headersSent) return next(err);

  const status = err.status || 500;
  const message = err.message || '서버 오류가 발생했습니다.';

  res.status(status).json({ message });
}
