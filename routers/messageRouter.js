import express from "express";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import { sendMessage, getMessage } from "../controllers/messageController.js";

const router = express.Router();

//here id is to whom we are sending message i.e. of reciever
router.post("/send/:id", isLoggedIn, sendMessage);
router.get("/get/:id", isLoggedIn, getMessage);

export default router;
