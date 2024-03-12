import dotenv from "dotenv";
import mongoose from "mongoose";
import { app, server } from "./socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

server.listen(PORT, (req, res) => {
  console.log("Listening on port " + PORT);
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => console.log("Database connection established"))
    .catch((e) => {
      console.log(`Error : ${e.message}`);
      process.exit(1);
    });
});
