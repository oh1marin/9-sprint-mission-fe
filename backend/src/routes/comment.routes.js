import express from 'express';
import { authRequired } from '../middlewares/auth.js';
import {
  createComment,
  updateComment,
  deleteComment,
  getProductComments
} from '../controllers/comment.controller.js';

const router = express.Router();

router.get('/products/:productId/comments', getProductComments);
router.post('/products/:productId/comments', authRequired, createComment);
router.patch('/comments/:commentId', authRequired, updateComment);
router.delete('/comments/:commentId', authRequired, deleteComment);

export default router;
