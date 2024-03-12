import express from "express";
import { getUsers, getUser } from "../controllers/userController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.get("/:username", isLoggedIn, getUser);
router.get("/", isLoggedIn, getUsers);

export default router;
