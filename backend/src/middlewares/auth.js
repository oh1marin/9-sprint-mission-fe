import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function authRequired(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증이 필요합니다.' });
  }

  const token = auth.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: payload.userId || payload.id || payload._id,
      email: payload.email,
      nickname: payload.nickname
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
}
