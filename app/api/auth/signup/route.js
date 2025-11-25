import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, nickname, password } = body;

    if (!email || !nickname || !password) {
      return NextResponse.json(
        { message: '이메일, 닉네임, 비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        nickname,
        encryptedPassword: hashedPassword,
      }
    });

    const accessToken = jwt.sign(
      {
        userId: newUser.id,
        email,
        nickname,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        accessToken,
        user: {
          id: newUser.id,
          email,
          nickname,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('signUp API error:', error);
    return NextResponse.json(
      { message: '회원가입 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}