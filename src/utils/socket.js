const socket = require("socket.io");
const { Chat } = require("../models/chatSchema");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://13.60.18.36", "http://localhost:5173"], // Allow requests from React app
      credentials: true, // Allow cookies/auth
    },
  });

  io.on("connection", (socket) => {
    //Handle

    socket.on("joinChat", ({ firstName, userId, toUserId }) => {
      const roomId = [userId, toUserId].sort().join("_");
      console.log(firstName + " joined RoomId :" + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, toUserId, text, photoURL }) => {
        try {
          const roomId = [userId, toUserId].sort().join("_");

          console.log(firstName + " says : " + text);

          let chat = await Chat.findOne({
            participants: { $all: [userId, toUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, toUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, text, photoURL });
        } catch (error) {
          console.log(error.message);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
