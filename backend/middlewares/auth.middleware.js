require("dotenv").config();
const jwt = require("jsonwebtoken");

/* Checking if the userId in the request body matches the userId in the token. If it does not match, it
will throw an error. */
module.exports.authTokenId = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};

/* Checking if the user is logged in. If the user is not logged in, it will return a 403 error. */
module.exports.auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    if (!decodedToken) {
      return res.status(403).json("unauthorized request");
    } else {
      next();
    }
  } catch (e) {
    res.status(401).json({ error: "Invalid request!" });
  }
};
