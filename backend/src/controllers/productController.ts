import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type ProductWithOwner = Prisma.ProductGetPayload<{
  include: { owner: { select: { nickname: true } } };
}>;

interface ProductResponse {
  id: number;
  name: string;
  description: string | null;
  price: number;
  tags: string[];
  images: string[];
  favoriteCount: number;
  createdAt: Date;
  ownerId: number | null;
  ownerNickname: string | null;
}

function mapProductToResponse(
  p: ProductWithOwner,
  extra: Record<string, any> = {}
): ProductResponse {
  const images = Array.isArray(p.images) ? p.images : [];

  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    tags: p.tags || [],
    images,
    favoriteCount: p.favoriteCount || 0,
    createdAt: p.createdAt,
    ownerId: p.ownerId || null,
    ownerNickname: p.owner?.nickname || null,
    ...extra,
  };
}

// 상품 생성 요청 바디 타입
interface CreateProductBody {
  name: string;
  price: string | number;
  description: string;
  images?: string | string[];
  tags?: string | string[];
}

export async function createProduct(
  req: Request<{}, {}, CreateProductBody>,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("createProduct req.body =", req.body);
    console.log("createProduct req.files =", req.files);

    const { name, price, description } = req.body;
    const bodyImages = req.body.images;
    const bodyTags = req.body.tags;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "로그인 후 이용해주세요." });
    }

    const fileImages = ((req.files as Express.Multer.File[]) || []).map(
      (file) => `/uploads/images/${file.filename}`
    );

    const images =
      bodyImages === undefined
        ? fileImages
        : Array.isArray(bodyImages)
        ? [...bodyImages, ...fileImages]
        : [bodyImages, ...fileImages];

    const tags: string[] = Array.isArray(bodyTags)
      ? bodyTags
      : typeof bodyTags === "string" && bodyTags.length > 0
      ? [bodyTags]
      : [];

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        description,
        images,
        tags,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });

    console.log("createProduct prisma result =", product);

    res.status(201).json(mapProductToResponse(product));
  } catch (err) {
    next(err);
  }
}

// 상품 목록 조회 쿼리 타입
interface GetProductsQuery {
  page?: string;
  pageSize?: string;
  orderBy?: string;
  keyword?: string;
}

export async function getProducts(
  req: Request<{}, {}, {}, GetProductsQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      page = "1",
      pageSize = "10",
      orderBy = "recent",
      keyword = "",
    } = req.query;

    const pageNum = parseInt(page);
    const sizeNum = parseInt(pageSize);
    const skip = (pageNum - 1) * sizeNum;

    const where: Prisma.ProductWhereInput = {};
    if (keyword) {
      where.name = {
        contains: keyword,
        mode: "insensitive",
      };
    }

    const orderByOption: Prisma.ProductOrderByWithRelationInput =
      orderBy === "favorite"
        ? { favoriteCount: "desc" }
        : { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy: orderByOption,
      skip,
      take: sizeNum,
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });

    const totalCount = await prisma.product.count({ where });

    const list = products.map((p) => mapProductToResponse(p));

    res.json({ totalCount, list });
  } catch (err) {
    next(err);
  }
}

export async function getBestProducts(
  req: Request<{}, {}, {}, { limit?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = parseInt(req.query.limit || "20");

    const products = await prisma.product.findMany({
      orderBy: { favoriteCount: "desc" },
      take: limit,
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });

    const list = products.map((p) => mapProductToResponse(p));

    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function getProductDetail(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.json(mapProductToResponse(product));
  } catch (err) {
    next(err);
  }
}

// 상품 수정 요청 바디 타입
interface UpdateProductBody {
  name?: string;
  price?: string | number;
  description?: string;
  images?: string | string[];
  tags?: string | string[];
}

export async function updateProduct(
  req: Request<{ productId: string }, {}, UpdateProductBody>,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("updateProduct req.body =", req.body);
    console.log("updateProduct req.files =", req.files);

    const { productId } = req.params;
    const { name, price, description, images, tags } = req.body;
    const userId = req.user?.id;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    if (product.ownerId !== userId) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    const fileImages = ((req.files as Express.Multer.File[]) || []).map(
      (file) => `/uploads/images/${file.filename}`
    );

    let finalImages: string[] | undefined;
    if (images !== undefined) {
      const bodyImages = Array.isArray(images) ? images : [images];
      finalImages = [...bodyImages, ...fileImages];
    } else if (fileImages.length > 0) {
      finalImages = [...(product.images || []), ...fileImages];
    }

    let finalTags: string[] | undefined;
    if (tags !== undefined) {
      finalTags = Array.isArray(tags)
        ? tags
        : typeof tags === "string" && tags.length > 0
        ? [tags]
        : [];
    }

    const updateData: Prisma.ProductUpdateInput = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (description !== undefined) updateData.description = description;
    if (finalImages !== undefined) updateData.images = finalImages;
    if (finalTags !== undefined) updateData.tags = finalTags;

    const updated = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: updateData,
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });

    res.json(mapProductToResponse(updated));
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    if (product.ownerId !== userId) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    await prisma.product.delete({
      where: { id: parseInt(productId) },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function addFavorite(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const userId = req.user!.id;

    const exists = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId),
        },
      },
    });

    if (exists) {
      return res.status(400).json({ message: "이미 좋아요를 눌렀습니다." });
    }

    await prisma.favorite.create({
      data: {
        userId: userId,
        productId: parseInt(productId),
      },
    });

    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        favoriteCount: {
          increment: 1,
        },
      },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(
  req: Request<{ productId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const userId = req.user!.id;

    const exists = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId),
        },
      },
    });

    if (!exists) {
      return res
        .status(400)
        .json({ message: "좋아요를 누른 기록이 없습니다." });
    }

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId),
        },
      },
    });

    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
