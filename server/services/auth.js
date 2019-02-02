const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const namespace = "http://localhost:3000/";

exports.checkJWT = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10, // Default value
    jwksUri: "https://dev-0kws86jw.auth0.com/.well-known/jwks.json" // Optional
  }),
  audience: "H5Z2uRcCJFpz2A8JDXEqWh4M91NH5Axl",
  issuer: "https://dev-0kws86jw.auth0.com/",
  algorithms: ["RS256"]
});

exports.checkRole = role => (req, res, next) => {
  const user = req.user;
  if (user && user[namespace + "role"] === role) {
    next();
  } else {
    res.status(401).send({
      title: "Not Authorized",
      details: "You are not authorized to access this data"
    });
  }
};
