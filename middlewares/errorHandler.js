module.exports = (err, _, res, next) => {
  const { message, statusCode = 500 } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? `server error:${message}` : message,
  });
  next(err);
};
