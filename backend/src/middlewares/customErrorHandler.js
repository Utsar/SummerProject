// backend>src>middlewares>customErrorHandler.js

// customErrorHandler.js
export const customErrorHandler = (error, req, res, next) => {
  if (error.isJoi) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Handle other types of errors here
  console.error("Internal Error:", error.message);
  return res.status(500).json({ error: "Internal Server Error" });
};
