const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err?.statusCode || 500;
  console.log(err);
  res.status(statusCode).json({
    status: "Error",
    message: err?.message ? err.message : "Internal Server Error",
  });
};

export default globalErrorHandler;
