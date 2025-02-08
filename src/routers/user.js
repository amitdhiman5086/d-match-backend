const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/userSchema");
const userRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoURL",
  "age",
  "about",
  "gender",
];

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loginUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loginUser._id,
      requestStatus: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    const countRequest =
      connectionRequest.length == undefined ? 0 : connectionRequest.length;

    res.json({
      message: "Your Requests are :" + countRequest,
      connectionRequest,
    });
  } catch (error) {
    res.status(404).json({
      message: "Error : " + error,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loginUser = req.user;

  const connections = await ConnectionRequestModel.find({
    $or: [
      { toUserId: loginUser._id, requestStatus: "accept" },
      { fromUserId: loginUser._id, requestStatus: "accept" },
    ],
  })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

  const data = connections.map((item) => {
    if (item.fromUserId._id.toString() == loginUser._id.toString()) {
      return item.toUserId;
    } else {
      return item.fromUserId;
    }
  });

  res.json({
    data,
  });
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loginUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limitNum = (() => {
      const lim = parseInt(req.query.limit);
      if (isNaN(lim) || lim > 50 || lim <= 0) {
        return 10;
      }
      return lim;
    })();
    const skipped = (page - 1) * limitNum;

    const connections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loginUser._id }, { toUserId: loginUser._id }],
    }).select(["fromUserId", "toUserId"]);

    const hideConnections = new Set();
    connections.map((req) => {
      hideConnections.add(req.fromUserId.toString());
      hideConnections.add(req.toUserId.toString());
    });

    const feedConnection = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideConnections) } },
        { _id: { $ne: loginUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skipped)
      .limit(limitNum);

    const totalNumberOfDocumment = await UserModel.countDocuments();

    const totalNumberOfPages = Math.ceil(totalNumberOfDocumment / limitNum);

    res.json({
      message: "Your Feed  is :",
      feedConnection,
      totalNumberOfPages,
    });
  } catch (error) {
    res.status(400).json({
      message: "ERROR : " + error.message,
    });
  }
});

module.exports = userRouter;
