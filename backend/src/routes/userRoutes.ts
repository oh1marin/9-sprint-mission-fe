import express, { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { authRequired } from "../middlewares/authRequired";

const router: Router = express.Router();
const prisma = new PrismaClient();

// 내 정보 조회
router.get(
  "/me",
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
      });

      if (!user) {
        return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
      }

      res.json({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 내가 등록한 상품 조회
router.get(
  "/me/products",
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await prisma.product.findMany({
        where: { ownerId: req.user!.id },
      });

      res.json({
        list: products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          tags: p.tags || [],
          images: p.images || [],
          favoriteCount: p.favoriteCount || 0,
          createdAt: p.createdAt,
        })),
      });
    } catch (err) {
      next(err);
    }
  }
);

// 내가 좋아요한 상품 조회
router.get(
  "/me/favorites",
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const favorites = await prisma.favorite.findMany({
        where: {
          userId: req.user!.id,
        },
        include: {
          product: true,
        },
      });

      res.json({
        list: favorites
          .filter((f) => f.product !== null)
          .map((f) => ({
            id: f.product!.id,
            name: f.product!.name,
            description: f.product!.description,
            price: f.product!.price,
            tags: f.product!.tags || [],
            images: f.product!.images || [],
            favoriteCount: f.product!.favoriteCount || 0,
            createdAt: f.product!.createdAt,
          })),
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
