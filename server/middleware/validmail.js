module.exports = (req, res, next) => {
  const { mail } = req.body;

  function validEmail(myMail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myMail);
  }

  if (!validEmail(mail)) {
    return res.status(401).json("Adresse mail invalide.");
  }
  next();
};
