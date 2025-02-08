const express = require("express");
const { userAuth } = require("../middleware/auth");
const { Chat } = require("../models/chatSchema");

const chatRouter = express.Router();

chatRouter.get("/chat/:toUserId", userAuth, async (req, res) => {
  const { toUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, toUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName photoURL",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, toUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json({
      chat,
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = { chatRouter };
