const express = require("express");
const connectDb = require("./config/dataBase.js");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRouter = require("./routers/auth.js");
const profileRouter = require("./routers/profile.js");
const requestRouter = require("./routers/request.js");
const userRouter = require("./routers/user.js");
const http = require("http");
const cors = require("cors");
const initializeSocket = require("./utils/socket.js");
const { chatRouter } = require("./routers/chat.js");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://13.60.18.36", "http://localhost:5173"], // Allow requests from React app
    credentials: true, // Allow cookies/auth
  })
);
dotenv.config();

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);
app.use("/api", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDb()
  .then(() => {
    console.log("Database is Connected...");

    server.listen(3000, () => {
      console.log("Server is listening on port");
    });
  })
  .catch((err) => {
    console.log("Error While Connecting to " + err);
  });
