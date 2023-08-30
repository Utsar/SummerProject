// backend>src>middlewares>customErrorHandler.js

export const customErrorHandler = (error, req, res, next) => {
  if (error && error.isJoi) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    next(error);
  }
};
