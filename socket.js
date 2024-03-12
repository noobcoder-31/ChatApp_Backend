import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routers/authRouters.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

import messageRouter from "./routers/messageRouter.js";
import userRouter from "./routers/userRouters.js";
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
//app.use(express.static("public"));
app.use(compression());
// app.get("/", (req, res) => {
//   res.sendFile(path.join("public", "index.html"));
// });

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/users", userRouter);
app.use("/*", (req, res, next) => {
  const err = new Error(`Route: ${req.originalUrl} not found`);
  next(err);
});

app.use(globalErrorHandler);

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;

    // Notify clients about the updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    // Remove the user from the userSocketMap if present
    for (const [key, value] of Object.entries(userSocketMap)) {
      if (value === socket.id) {
        delete userSocketMap[key];
        break;
      }
    }
    // Notify clients about the updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
