const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwtGenerator = require("../utils/jwtGenerator");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password1, 10)
    .then((hash) => {
      const user = new User({
        mail: req.body.mail,
        pseudo: req.body.pseudo,
        password: hash,
      });

      User.findOne({ pseudo: req.body.pseudo }).then((result) => {
        if (result !== null) {
          return res.status(401).json("Pseudo déjà utilisé.");
        } else {
          User.findOne({ mail: req.body.mail }).then((result) => {
            if (result !== null) {
              return res.status(401).json("Adresse mail déjà utilisée.");
            } else {
              user
                .save()
                .then(() => {
                  // Génératon token
                  const token = jwtGenerator(user._id, "24hr");
                  res.json({ token, user });
                })
                .catch((error) => {
                  console.log(error);
                  res.status(400).json({ error });
                });
            }
          });
        }
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

exports.modifyinfo = (req, res, next) => {
  try {
    User.findOne({ _id: req.userId }).then((user) => {
      User.findOne({ pseudo: req.body.pseudo }).then((result) => {
        if (result !== null && result._id.toString() !== req.userId) {
          return res.status(401).json("Pseudo déjà utilisé.");
        } else {
          User.findOne({ mail: req.body.mail }).then((result) => {
            if (result !== null && result._id.toString() !== req.userId) {
              return res.status(401).json("Adresse mail déjà utilisée.");
            } else {
              bcrypt.hash(req.body.password1, 10).then((hash) => {
                console.log(req.body.pseudo);
                User.updateOne(
                  { _id: req.userId },
                  {
                    _id: req.userId,
                    pseudo: req.body.pseudo,
                    mail: req.body.mail,
                    password: hash,
                  }
                ).then((thing) => {
                  res.json(true);
                });
              });
            }
          });
        }
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
};

exports.login = (req, res, next) => {
  User.findOne({ mail: req.body.mail })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }

      bcrypt
        .compare(req.body.password1, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          const token = jwtGenerator(user._id, "24hr");
          res.json({ token, user });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.verif = (req, res, next) => {
  try {
    let isAuth = false;
    User.findOne({ _id: req.userId }).then((user) => {
      isAuth = true;
      res.json({ isAuth, user });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
};

exports.getinfo = (req, res, next) => {
  try {
    User.findOne({ _id: req.userId }).then((user) => {
      res.json({ user });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
};

exports.deleteuser = (req, res, next) => {
  try {
    User.remove({ _id: req.userId }).then((toto) => {
      res.json(true);
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json("Erreur serveur");
  }
};
