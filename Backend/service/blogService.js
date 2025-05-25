import Blog from '../models/blog.js';

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// Get published blogs only
export const getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    res.status(500).json({ message: 'Failed to fetch published blogs' });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, author, imageUrl, isPublished } = req.body;
    
    const newBlog = new Blog({
      title,
      content,
      author,
      imageUrl,
      isPublished
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

// Update a blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, imageUrl, isPublished } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        author,
        imageUrl,
        isPublished,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Failed to update blog' });
  }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};

// Toggle publish status
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        isPublished,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error toggling publish status:', error);
    res.status(500).json({ message: 'Failed to update publish status' });
  }
}; 