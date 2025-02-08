const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is Not Valid" + email);
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter Strong Password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "skills",
    "gender",
    "photoURL",
    "about",
  ];

  const isAllowed = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key)
  );

  if (req.body.photoURL && !validator.isURL(req.body?.photoURL)) {
    throw new Error("Photo URL is Not Valid");
  }

  return isAllowed;
};

const validatePassword = (req) => {
  const allowedField = ["password", "currentPassword"];

  const isAllowed = Object.keys(req.body).every((key) =>
    allowedField.includes(key)
  );

  if (req.body.password && !validator.isStrongPassword(req.body.password)) {
    throw new Error("Please Enter Strong Password");
  }

  return isAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validatePassword
};
