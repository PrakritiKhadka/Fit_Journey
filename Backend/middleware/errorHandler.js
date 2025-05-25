
// 404 Not Found handler
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      success: false,
      message: 'Resource not found',
    });
  };
  
  // General error handler
  export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  };
  