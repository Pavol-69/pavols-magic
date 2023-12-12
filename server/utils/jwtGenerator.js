const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id, time) {
  const payload = {
    user: user_id,
  };
  if (process.env.NODE_ENV === "production") {
    return jwt.sign(payload, process.env.HEROKU_JWT_SECRET, {
      expiresIn: `${time}`,
    });
  } else {
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: `${time}`,
    });
  }
}

module.exports = jwtGenerator;
