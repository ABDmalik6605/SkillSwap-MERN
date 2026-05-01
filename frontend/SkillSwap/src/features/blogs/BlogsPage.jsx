import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBlogs, createBlog, deleteBlog } from './blogsSlice.js';
import { Icons, Icon } from '../../utils/icons.jsx';
import Button from '../../components/ui/Button.jsx';
import useAuth from '../../hooks/useAuth.js';
import toast from 'react-hot-toast';

const TAG_COLORS = [
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-pink-100 text-pink-700',
  'bg-yellow-100 text-yellow-700'
];

const BlogsPage = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', tags: '' });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchBlogs(tagFilter ? { tag: tagFilter } : {}));
  }, [dispatch, tagFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      content: form.content,
      excerpt: form.excerpt,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean)
    };
    await dispatch(createBlog(payload));
    toast.success('Blog post published! 🎉');
    setForm({ title: '', content: '', excerpt: '', tags: '' });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await dispatch(deleteBlog(id));
    toast.success('Post deleted');
  };

  // Collect all unique tags for filter chips
  const allTags = [...new Set(list.flatMap((b) => b.tags || []))];

  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text flex items-center gap-3">
              SkillSwap Blog
              <Icon icon={Icons.lightbulb} size="xl" className="text-yellow-500" />
            </h1>
            <p className="text-slate-600 mt-1">Insights, tips, and community stories</p>
          </div>
          {isAuthenticated && (
            <Button
              onClick={() => setShowForm((v) => !v)}
              className="btn-gradient flex items-center gap-2 shrink-0"
            >
              <Icon icon={showForm ? Icons.close : Icons.edit} size="md" />
              {showForm ? 'Cancel' : 'Write a Post'}
            </Button>
          )}
        </div>

        {/* Create Post Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 shadow-xl space-y-4 animate-fade-in"
          >
            <h2 className="font-bold text-lg text-slate-900">New Blog Post</h2>
            <input
              required
              placeholder="Post title *"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none text-slate-900 bg-white/80"
            />
            <textarea
              required
              rows={6}
              placeholder="Write your content here... *"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none text-slate-900 bg-white/80 resize-none"
            />
            <input
              placeholder="Short excerpt (optional)"
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none text-slate-900 bg-white/80"
            />
            <input
              placeholder="Tags (comma-separated, e.g. react, learning)"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-brand-400 focus:outline-none text-slate-900 bg-white/80"
            />
            <div className="flex gap-3">
              <Button type="submit" className="btn-gradient">Publish</Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        )}

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTagFilter('')}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${tagFilter === '' ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag === tagFilter ? '' : tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${tag === tagFilter ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {status === 'loading' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl p-6 space-y-3 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Blog Cards */}
        {status !== 'loading' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((blog, i) => (
              <article
                key={blog._id}
                className="glass rounded-2xl shadow-lg card-hover overflow-hidden flex flex-col"
              >
                {/* Gradient bar */}
                <div className={`h-2 bg-gradient-to-r ${i % 2 === 0 ? 'from-brand-400 to-accent-400' : 'from-purple-400 to-pink-400'}`} />
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  {/* Tags */}
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 3).map((tag, ti) => (
                        <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TAG_COLORS[ti % TAG_COLORS.length]}`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="font-bold text-lg text-slate-900 leading-tight">{blog.title}</h2>
                  <p className="text-sm text-slate-600 flex-1 leading-relaxed">
                    {expandedId === blog._id
                      ? blog.excerpt || blog.content?.substring(0, 400)
                      : (blog.excerpt || blog.content?.substring(0, 120)) + '...'}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/30">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                        {blog.author?.name?.[0] || 'A'}
                      </div>
                      <span className="font-medium">{blog.author?.name || 'Anonymous'}</span>
                      <span>·</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Icon icon={Icons.globe} size="sm" />
                      {blog.views ?? 0}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setExpandedId(expandedId === blog._id ? null : blog._id)}
                      className="text-xs text-brand-600 font-semibold hover:underline"
                    >
                      {expandedId === blog._id ? 'Show less' : 'Read more'}
                    </button>
                    {isAuthenticated && user?._id === blog.author?._id && (
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-xs text-red-500 font-semibold hover:underline ml-auto"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {status !== 'loading' && list.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
              <Icon icon={Icons.lightbulb} size="3xl" className="text-slate-500" />
            </div>
            <p className="text-slate-600 text-lg">No posts yet.{isAuthenticated ? ' Be the first to write one!' : ' Sign in to contribute!'}</p>
            {!isAuthenticated && (
              <Link to="/register">
                <Button className="btn-gradient">Join SkillSwap</Button>
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogsPage;
