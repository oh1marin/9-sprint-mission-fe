import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 댓글 조회
export async function getProductComments(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId) },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      list: comments.map((c) => ({
        id: c.id,
        content: c.content,
        writer: {
          id: c.user.id,
          nickname: c.user.nickname,
        },
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

// 댓글 생성
export async function createComment(
  req: Request<{ productId: string }, {}, { content: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "content는 필수입니다." });
    }

    const comment = await prisma.comment.create({
      data: {
        productId: parseInt(productId),
        content,
        userId: req.user!.id,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    res.status(201).json({
      id: comment.id,
      content: comment.content,
      writer: {
        id: comment.user.id,
        nickname: comment.user.nickname,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    });
  } catch (err) {
    next(err);
  }
}

// 댓글 수정
export async function updateComment(
  req: Request<{ commentId: string }, {}, { content: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    if (!comment) return res.status(404).json({ message: "댓글 없음" });

    if (comment.userId !== req.user!.id)
      return res.status(403).json({ message: "권한 없음" });

    const updated = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    res.json({
      id: updated.id,
      content: updated.content,
      writer: {
        id: updated.user.id,
        nickname: updated.user.nickname,
      },
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (err) {
    next(err);
  }
}

// 댓글 삭제
export async function deleteComment(
  req: Request<{ commentId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });

    if (!comment) return res.status(404).json({ message: "댓글 없음" });

    if (comment.userId !== req.user!.id)
      return res.status(403).json({ message: "권한 없음" });

    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
