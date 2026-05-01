import { Router } from 'express';
import Joi from 'joi';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { listBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';

const router = Router();

const blogSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  content: Joi.string().min(20).required(),
  excerpt: Joi.string().max(500).allow('').optional(),
  coverImage: Joi.string().uri().allow('').optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional()
});

const updateBlogSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  content: Joi.string().min(20).optional(),
  excerpt: Joi.string().max(500).allow('').optional(),
  coverImage: Joi.string().uri().allow('').optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional()
}).min(1);

router.get('/', listBlogs);
router.get('/:id', getBlog);
router.post('/', authenticate, validate(blogSchema), createBlog);
router.patch('/:id', authenticate, validate(updateBlogSchema), updateBlog);
router.delete('/:id', authenticate, deleteBlog);

export default router;
