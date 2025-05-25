import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/BlogView.css';

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error loading blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!blog) {
    return <div className="error-message">Blog post not found</div>;
  }

  return (
    <div className="blog-view-container">
      <article className="blog-post">
        <header className="blog-header">
          <h1>{blog.title}</h1>
          <div className="blog-meta">
            <span className="blog-author">By {blog.author}</span>
            <span className="blog-date">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>
        </header>
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
};

export default BlogView; 