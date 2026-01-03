import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

interface JwtPayload {
  userId?: number;
  id?: number;
  _id?: number;
}

export async function authRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  const token = auth.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = payload.userId || payload.id || payload._id;

    if (!userId) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
}
