const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userSchema");
const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    //Validating the req.body
    validateSignUpData(req);

    const {
      firstName,
      lastName,
      email,
      password,
      age,
      skills,
      gender,
      photoURL,
      about,
    } = req.body;

    const passwordHash = bcrypt.hashSync(password, 8);

    // console.log(passwordHash);

    const user = new UserModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
      age,
      photoURL,
      gender,
      about,
      skills,
    });
    const data = await user.save();

    const token = await user.getJWT();
    const userData = data.toObject();
    delete userData.password;


    res.cookie("token", token, {
      expires: new Date(Date.now() + 720 * 3600000),
    });
    res.json({
      message: userData.firstName + " is Registered Successfully ",
      data: userData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!(email && validator.isEmail(email))) {
    return res.status(400).send("Email is Not Valid");
  }

  const user = await UserModel.findOne({ email: email });
  if (!user) {
    return res.status(404).send("Invalid Credential");
  }
  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) {
    return res.status(400).send("Invalid Credential");
  }

  const token = await user.getJWT();
  //Deleteing the sensitive Information
  const userData = user.toObject();
  delete userData.password;

  res.cookie("token", token, { expires: new Date(Date.now() + 720 * 3600000) });
  res.json({
    message: "Authenticated ..",
    data: userData,
  });
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({
    message: "Logout successfully.",
  });
});

module.exports = authRouter;
