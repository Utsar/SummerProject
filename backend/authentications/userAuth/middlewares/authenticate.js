import expressJwt from "express-jwt";

const authenticate = expressJwt({
  secret: "your-secret-jwt-key",
  algorithms: ["HS256"],
  userProperty: "auth",
});

authenticate.unless = (options) => {
  const middleware = (req, res, next) => {
    if (options.path.includes(req.path)) {
      return next();
    }

    authenticate(req, res, next);
  };

  return middleware;
};

export default authenticate;
