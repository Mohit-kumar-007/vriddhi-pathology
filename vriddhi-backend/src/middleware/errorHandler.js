// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.error('Error:', err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
