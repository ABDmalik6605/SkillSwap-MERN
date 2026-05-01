import Blog from '../models/Blog.js';

/**
 * GET /api/blogs  — list all published blogs, newest first
 * GET /api/blogs?tag=foo  — filter by tag
 */
export const listBlogs = async (req, res, next) => {
  try {
    const filter = { isPublished: true };
    if (req.query.tag) filter.tags = req.query.tag;
    const blogs = await Blog.find(filter)
      .populate('author', 'name avatarUrl')
      .sort('-createdAt')
      .select('-content'); // exclude heavy content in list view
    res.json(blogs);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/blogs/:id  — get a single blog post (increments views)
 */
export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatarUrl bio');
    if (!blog) { res.status(404); throw new Error('Blog not found'); }
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/blogs  — create a new blog post (auth required)
 */
export const createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user._id });
    await blog.populate('author', 'name avatarUrl');
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/blogs/:id  — update own blog post
 */
export const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
    if (!blog) { res.status(404); throw new Error('Blog not found or not yours'); }
    Object.assign(blog, req.body);
    await blog.save();
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/blogs/:id  — delete own blog post
 */
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!blog) { res.status(404); throw new Error('Blog not found or not yours'); }
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    next(err);
  }
};
