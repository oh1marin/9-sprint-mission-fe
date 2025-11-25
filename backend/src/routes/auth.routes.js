import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/signUp', async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json({ message: '필수 입력값이 누락되었습니다.' });
    }

    const exists = await prisma.user.findUnique({
      where: { email }
    });
    
    if (exists) {
      return res.status(409).json({ message: '이미 가입된 이메일입니다.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        encryptedPassword: hashed,
      }
    });

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/signIn', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const isValid = await bcrypt.compare(password, user.encryptedPassword);
    if (!isValid) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;