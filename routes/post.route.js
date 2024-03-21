import { Router } from "express";
import { getPost, createPost } from "../controllers/post.controller.js";
import { requireToken } from "../middlewares/requireToken.js";
const router = Router()

// GET /api/v1/post
// GET /api/v1/post/:id
// POST /api/v1/post
// PUT /api/v1/post/:id
// DELETE /api/v1/post/:id

router.get('/', requireToken, getPost)
router.post('/', requireToken, createPost)
export default router;