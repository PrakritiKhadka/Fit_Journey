import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [latestBlogs, setLatestBlogs] = useState([]);

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  const fetchLatestBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/blogs');
      const publishedBlogs = response.data
        .filter(blog => blog.isPublished)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setLatestBlogs(publishedBlogs);
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
    }
  };

  return (
    <div className="homepage">
      {/* Latest Blogs Section */}
      <section className="latest-blogs">
        <h2>Latest from Our Blog</h2>
        <div className="blog-grid">
          {latestBlogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              <div className="blog-image">
                <img src={blog.imageUrl} alt={blog.title} />
              </div>
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p className="blog-meta">
                  By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <div 
                  className="blog-excerpt"
                  dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 150) + '...' }}
                />
                <Link to="/blog" className="read-more">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage; 