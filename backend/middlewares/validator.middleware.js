const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");

/* It's a middleware that will check if the email and password are valid. */
exports.valid = (req, res, next) => {
  const passwordSchema = new passwordValidator();
  passwordSchema
    .is()
    .min(8)
    .is()
    .max(20)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .not()
    .symbols();

  if (
    !emailValidator.validate(req.body.email) ||
    !passwordSchema.validate(req.body.password)
  ) {
    return res.status(400).send({
      error: "Merci de vérifier l'adresse mail et le mot de passe ",
    });
  } else if (
    emailValidator.validate(req.body.email) ||
    passwordSchema.validate(req.body.password)
  ) {
    next();
  }
};

/* It's a middleware that will check if the pseudo is valid. */
exports.checkPseudo = (req, res, next) => {
  // on vérifie le pseudo
  const regex = /^[a-zA-Z0-9_]{3,30}$/; // Lettres, espaces et doit être entre 4 et 30 caractères
  const pseudo = req.body.pseudo;
  if (regex.test(pseudo) === true) {
    next();
  } else {
    return res.status(400).send({
      error:
        "Le pseudo doit être de 3 caractères minimum et 30 maximum, sont acceptées les lettres, chiffres et underscore (_)  ",
    });
  }
};
