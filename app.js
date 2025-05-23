const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
module.exports = app;
const userRoutes = require("./routes/user");
const deckRoutes = require("./routes/deck");
require("dotenv").config();

var bodyParser = require("body-parser");

app.use(express.json());

// Besoin de créer un compte MongoDB
mongoose
  .connect(
    process.env.NODE_ENV === "production"
      ? "mongodb+srv://" +
          process.env.HEROKU_DB_USER +
          ":" +
          process.env.HEROKU_DB_PASSWORD +
          "@" +
          process.env.HEROKU_DB_NAME +
          ".etrcplr.mongodb.net/"
      : "mongodb+srv://" +
          process.env.DB_USER +
          ":" +
          process.env.DB_PASSWORD +
          "@" +
          process.env.DB_NAME +
          ".etrcplr.mongodb.net/",

    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion a MongoDB reussie !"))
  .catch((err) => console.log("Connexion a MongoDB echouee ! " + err));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/deck", deckRoutes);

/*app.post('/api/deck', (req, res, next) => {
    console.log(req.body.name);
    console.log(req.body.userId);
});*/
