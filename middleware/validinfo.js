module.exports = (req, res, next) => {
  const { mail, pseudo, password1, password2 } = req.body;

  function validEmail(myMail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myMail);
  }

  if (req.path === "/signup" || req.path === "/modifyInfo") {
    if (![mail, pseudo, password1, password2].every(Boolean)) {
      return res.status(401).json("Informations manquantes.");
    } else if (!validEmail(mail)) {
      return res.status(401).json("Adresse mail invalide.");
    } else if (password1 !== password2) {
      return res
        .status(401)
        .json("Les deux mots de passe ne correspondent pas.");
    }
  } else if (req.path === "/login") {
    if (![mail, password1].every(Boolean)) {
      return res.status(401).json("Informations manquantes.");
    } else if (!validEmail(mail)) {
      return res.status(401).json("Adresse mail invalide.");
    }
  }
  next();
};
