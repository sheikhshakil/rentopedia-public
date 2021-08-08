const { body } = require("express-validator");

const regValidator = [
  body("fullName").trim().not().isEmpty().withMessage("Name can't be empty!"),
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Provide a valid email!"),

  body("password")
    .isLength({ min: 4, max: 15 })
    .withMessage("Password should be minimum 4-15 chars long!"),

  body("gender")
    .not()
    .equals("Choose your gender")
    .withMessage("Please choose your gender!"),
];

module.exports = regValidator;
