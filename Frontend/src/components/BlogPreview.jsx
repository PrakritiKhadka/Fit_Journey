import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlogPreview.css';

const DEFAULT_IMAGE = 'https://fitjourney.ai/hubfs/fj_logo@2x-1.png';

const BlogPreview = ({ blog }) => {
  const imageUrl = blog.imageUrl && blog.imageUrl.trim() !== '' ? blog.imageUrl : DEFAULT_IMAGE;
  return (
    <Link to={`/blog/${blog._id}`} className="blog-preview blog-preview-link">
      <div className="blog-image-link">
        <div className="blog-image-wrapper">
          <img
            src={imageUrl}
            alt={blog.title}
            className="blog-image"
            loading="lazy"
            onError={e => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
          />
        </div>
      </div>
      <div className="blog-content">
        <h2 className="blog-title">{blog.title}</h2>
        <p className="blog-description">
          {blog.description || blog.content?.replace(/<[^>]+>/g, '').slice(0, 100) + '...'}
        </p>
      </div>
      <div className="blog-meta">
        <span className="blog-author">{blog.author ? `By ${blog.author}` : ''}</span>
        <span className="blog-date">
          {new Date(blog.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
};

export default BlogPreview; 