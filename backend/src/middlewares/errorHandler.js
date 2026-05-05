export const notFoundHandler = (req, res, next) => {
  res.status(404);
  next(new Error(`Route ${req.originalUrl} not found`));
};

export const errorHandler = (err, req, res, next) => {
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || 'Unexpected error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
