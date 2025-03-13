const errorHandler = (error, req, res, next) => {
  console.error("Error", error);

  res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Internal server error",
  });
};

export default errorHandler;
