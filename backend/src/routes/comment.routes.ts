import express, { Router } from "express";
import { authRequired } from "../middlewares/authRequired";
import {
  createComment,
  updateComment,
  deleteComment,
  getProductComments,
} from "../controllers/commentController";

const router: Router = express.Router();

router.get("/products/:productId/comments", getProductComments);
router.post("/products/:productId/comments", authRequired, createComment);
router.patch("/comments/:commentId", authRequired, updateComment);
router.delete("/comments/:commentId", authRequired, deleteComment);

export default router;
