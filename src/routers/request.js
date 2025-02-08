const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequestModel = require("../models/connectionRequest.js");
const UserModel = require("../models/userSchema.js");
const requestRouter = express.Router();
const sendEmail = require("../utils/sendEmail.js");

requestRouter.post(
  "/request/send/:requestStatus/:toUserId",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const requestStatus = req.params.requestStatus;

      const allowedMethods = ["ignore", "interested"];
      if (!allowedMethods.includes(requestStatus)) {
        return res.status(400).json({
          message: "Invalid Status Code : " + requestStatus,
        });
      }

      const toUser = await UserModel.findById(toUserId);

      if (!toUser) {
        return res.status(400).json({
          message: "User Not Found !",
        });
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request is Already Existis",
        });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        requestStatus,
      });

      const data = await connectionRequest.save();

      const emailRes = await sendEmail.run();

      res.json({
        message:
          req.user.firstName +
          " is " +
          requestStatus +
          " in " +
          toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("Error :" + error.message);
    }
  }
);

requestRouter.patch(
  "/request/review/:requestStatus/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loginUser = req.user;
      const { requestStatus, requestId } = req.params;

      const allowedStatuses = ["accept", "reject"];

      if (!allowedStatuses.includes(requestStatus)) {
        throw new Error("This status is not allowed :" + requestStatus);
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loginUser._id,
        requestStatus: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Request not Found!!",
        });
      }

      connectionRequest.requestStatus = requestStatus;
      // console.log(connectionRequest);

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request is " + requestStatus,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  }
);

module.exports = requestRouter;
