import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    excerpt: { type: String, maxlength: 500 },
    coverImage: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Auto-generate excerpt from content if not provided
blogSchema.pre('save', function generateExcerpt(next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.replace(/(<([^>]+)>)/gi, '').substring(0, 300) + '...';
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
