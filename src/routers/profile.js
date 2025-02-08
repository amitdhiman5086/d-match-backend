const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const {
  validateEditProfileData,
  validatePassword,
} = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const userData = user.toObject();
    delete userData.password;
    res.json({
      data: userData,
    });
  } catch (error) {
    res.status(400).send("Something Went Wrong in Profile Api");
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Fields");
    }

    const loginedUser = req.user;

    Object.keys(req.body).forEach((key) => (loginedUser[key] = req.body[key]));

    await loginedUser.save();

    res.json({
      message: `${loginedUser.firstName} Your profile Updated Successfully`,
      data: loginedUser,
    });
  } catch (error) {
    res.status(400).send("ERROR in profile Edit API : " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loginedUser = req.user;
    if (!validatePassword(req)) {
      throw new Error("Enter Valid Fields");
    }
    const { password, currentPassword } = req.body;

    const isPasswordCorrect = await loginedUser.validatePassword(
      currentPassword
    );
    if (!isPasswordCorrect) {
      throw new Error("Password is Not Correct");
    }
    const passwordHash = await bcrypt.hashSync(password, 8);

    loginedUser.password = passwordHash;

    await loginedUser.save();
    res.json({
      message: `${loginedUser.firstName} Your Password is Updated Successfully`,
      data: loginedUser,
    });
  } catch (error) {
    res.status(400).send("Error in Password API : " + error.message);
  }
});
module.exports = profileRouter;
