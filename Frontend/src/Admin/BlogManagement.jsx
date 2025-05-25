import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Plus,ArrowLeft } from 'lucide-react';
import axios from 'axios';
import '../styles/BlogManagement.css';
import { useNavigate } from 'react-router-dom';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    imageUrl: '',
    isPublished: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const content = editor ? editor.getHTML() : '';

      if (selectedBlog) {
        await axios.put(`http://localhost:5001/api/blogs/${selectedBlog._id}`, {
          ...formData,
          content,
        });
        setSuccess('Blog updated successfully');
      } else {
        await axios.post('http://localhost:5001/api/blogs', {
          ...formData,
          content,
        });
        setSuccess('Blog created successfully');
      }
      
      // Reset form and close modal
      setFormData({
        title: '',
        author: '',
        imageUrl: '',
        isPublished: false,
      });
      editor?.commands.setContent('');
      setSelectedBlog(null);
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error('Error saving blog:', err);
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      author: blog.author,
      imageUrl: blog.imageUrl,
      isPublished: blog.isPublished,
    });
    
    editor?.commands.setContent(blog.content);
    setIsModalOpen(true);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5001/api/blogs/${blogId}`);
        setSuccess('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        setError('Failed to delete blog');
      }
    }
  };

  const handleTogglePublish = async (blogId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5001/api/blogs/${blogId}/publish`, {
        isPublished: !currentStatus
      });
      setSuccess(`Blog ${currentStatus ? 'unpublished' : 'published'} successfully`);
      fetchBlogs();
    } catch (error) {
      console.error('Error updating publish status:', error);
      setError('Failed to update publish status');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      author: '',
      imageUrl: '',
      isPublished: false,
    });
    editor?.commands.setContent('');
    setSelectedBlog(null);
    setIsModalOpen(false);
  };

  const openNewBlogModal = () => {
    setSelectedBlog(null);
    setFormData({
      title: '',
      author: '',
      imageUrl: '',
      isPublished: false,
    });
    editor?.commands.setContent('');
    setIsModalOpen(true);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="blog-management">
      <div className="back-button-container">
      <button onClick={() => navigate('/AdminPanel')} className="back-button">
        <ArrowLeft className="back-icon" />
        <span>Go Back</span>
      </button>
      </div>

      <h2>Blog Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Blog List Section */}
      <div className="blogs-list">
        <div className="blogs-header">
          <h2>All Blogs</h2>
          <button className="add-blog-btn" onClick={openNewBlogModal}>
            <Plus size={20} />
            Add New Blog
          </button>
        </div>
        {blogs.map((blog) => (
          <div key={blog._id} className="blog-item">
            <h3>{blog.title}</h3>
            <span className={`status-badge ${blog.isPublished ? 'status-published' : 'status-draft'}`}>
              {blog.isPublished ? 'Published' : 'Draft'}
            </span>
            <p>Created: {new Date(blog.createdAt).toLocaleDateString()}</p>
            <div className="blog-actions">
              <button onClick={() => handleEdit(blog)} className="edit-button">
                Edit
              </button>
              <button
                onClick={() => handleTogglePublish(blog._id, blog.isPublished)}
                className={blog.isPublished ? 'unpublish-button' : 'publish-button'}
              >
                {blog.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedBlog ? "Edit Blog" : "Create New Blog"}</h3>
              <button className="modal-close" onClick={handleCancel}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content:</label>
                <div className="editor-toolbar">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'is-active' : ''}
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'is-active' : ''}
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                  >
                    Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                  >
                    Numbered List
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = window.prompt('Enter the URL');
                      if (url) {
                        editor.chain().focus().setLink({ href: url }).run();
                      }
                    }}
                    className={editor.isActive('link') ? 'is-active' : ''}
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = window.prompt('Enter the image URL');
                      if (url) {
                        editor.chain().focus().setImage({ src: url }).run();
                      }
                    }}
                  >
                    Image
                  </button>
                </div>
                <div className="editor-container">
                  <EditorContent editor={editor} />
                </div>
              </div>
              <div className="form-group">
                <label>Author:</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                  />
                  Publish
                </label>
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {selectedBlog ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement; 