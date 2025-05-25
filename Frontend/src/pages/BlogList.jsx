import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogPreview from '../components/BlogPreview';
import '../styles/BlogList.css';

const BLOGS_PER_PAGE = 12;

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs/published');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error loading blogs:', error);
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
  const startIdx = (page - 1) * BLOGS_PER_PAGE;
  const endIdx = startIdx + BLOGS_PER_PAGE;
  const blogsToShow = blogs.slice(startIdx, endIdx);

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="blog-list-container">
      <h1>Latest Blogs</h1>
      {blogs.length === 0 ? (
        <p className="no-blogs">No blog posts available yet.</p>
      ) : (
        <>
          <div className="blog-grid">
            {blogsToShow.map((blog) => (
              <BlogPreview key={blog._id} blog={blog} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogList; 