import express from "express";
import {
  createProduct,
  getProducts,
  getBestProducts,
  getProductDetail,
  updateProduct,
  deleteProduct,
  addFavorite,
  removeFavorite,
} from "../controllers/product.controller.js";
import { authRequired } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/", authRequired, upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.get("/best", getBestProducts);
router.get("/:productId", getProductDetail);
router.patch(
  "/:productId",
  authRequired,
  upload.array("images", 5),
  updateProduct
);
router.delete("/:productId", authRequired, deleteProduct);
router.post("/:productId/favorite", authRequired, addFavorite);
router.delete("/:productId/favorite", authRequired, removeFavorite);

export default router;
