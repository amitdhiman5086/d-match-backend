const UserModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(404).send("Token Not Recevied");
    }
    const data = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(data._id);
    if (!user) {
      throw new Error("User Not Found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error in The User Atuh : " + error.message);
  }
};

module.exports = {
  userAuth,
};
