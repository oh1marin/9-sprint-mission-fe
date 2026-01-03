import { NextResponse, type NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET: string = process.env.JWT_SECRET || "dev-secret";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginRequestBody;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호는 필수입니다." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.encryptedPassword);

    if (!isValid) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("login API error:", error);
    return NextResponse.json(
      { message: "로그인 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
