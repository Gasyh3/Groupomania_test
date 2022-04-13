const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const jwt = require("jsonwebtoken");

exports.valid = (req, res, next) => {
  // on vérifie le password et l'email
  const passwordSchema = new passwordValidator();
  passwordSchema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(20) // Maximum length 20
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .not()
    .symbols(); // Has no symbols
  //.has().not().spaces()
  // Should not have spaces is a wrong rule to apply

  if (
    !emailValidator.validate(req.body.email) ||
    !passwordSchema.validate(req.body.password)
  ) {
    return res.status(400).send({
      error:
        "Merci de vérifier ton adresse mail, ton mot de passe doit contenir au minum 8 lettres avec des minuscules et majuscules  ",
    });
  } else if (
    emailValidator.validate(req.body.email) ||
    passwordSchema.validate(req.body.password)
  ) {
    next();
  }
};
exports.checkUsername = (req, res, next) => {
  // on vérifie le pseudo
  const regex = /^[a-zA-Z0-9_]{3,30}$/; // Lettres, espaces et doit être entre 4 et 30 caractères
  const username = req.body.username;
  if (regex.test(username) === true) {
    next();
  } else {
    return res.status(400).send({
      error:
        "Votre pseudo doit être de 3 caractères minimum et 30 maximum, sont acceptées les lettres, chiffres et underscore (_)  ",
    });
  }
};

exports.auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // on récupère le token de la requête entrante
    const decodedToken = jwt.verify(token, "secret"); // on le vérifie
    const userId = decodedToken.sub; // on récupère l'id du token
    if (req.body.userId && req.body.userId !== userId) {
      // on compare le userid de la requête à celui du token
      throw "User id non valable !";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: new Error("Invalid request !") });
  }
};
