import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/blogs/published');

      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-container">
        <div className="loading">Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <h1>Our Blog</h1>
      {blogs.length === 0 ? (
        <div className="no-blogs">No published blogs available.</div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <div className="blog-image">
                <img src={blog.imageUrl} alt={blog.title} />
              </div>
              <div className="blog-content">
                <h2>{blog.title}</h2>
                <p className="blog-meta">
                  By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <div 
                  className="blog-excerpt"
                  dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 200) + '...' }}
                />
                <button className="read-more">Read More</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog; 