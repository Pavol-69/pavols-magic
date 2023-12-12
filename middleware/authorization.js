require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Non autorisé");
    }

    const payload = jwt.verify(
      jwtToken,
      process.env.NODE_ENV === "production"
        ? process.env.HEROKU_JWT_SECRET
        : process.env.TOKEN_SECRET
    );

    req.userId = payload.user;

    next();
  } catch (err) {
    console.log(err);
    res.status(403).json("Token non valide.");
  }
};
