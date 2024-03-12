import User from "../models/userModle.js";
import bcryptjs from "bcryptjs";
import getToken from "../utils/getToken.js";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      const err = new Error("User does not exist");
      err.statusCode = 404;
      throw err;
    }
    const isPasswordCorrect = bcryptjs.compare(password, user?.password || "");

    if (isPasswordCorrect) {
      const token = getToken(user?._id);

      res.status(200).send({
        status: "Success",
        message: "User Logged in successfully ",
        data: {
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
          picture: user.picture,
          gender: user.gender,
          token: token,
        },
      });
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // retrieving jwwt tokens from header of request
    const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("You must login first to logout");
    }
    const isValid = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!isValid) {
      throw new Error("You must login first to logout");
    }

    res.status(200).json({
      status: "success",
      message: "You have been logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { fullname, username, password, gender, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      const err = new Error("Password does not match");
      err.statusCode = 403;
      throw err;
    }

    const user2 = await User.findOne({ username });
    if (user2) {
      const err = new Error("Username already exists");
      err.statusCode = 400;
      throw err;
    }

    const boypic = `https://avatar.iran.liara.run/public/boy?usearname=${username}`;
    const girlpic = `https://avatar.iran.liara.run/public/girl?usearname=${username}`;

    const salt = await bcryptjs.genSalt(10);
    const hashedpassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      fullname,
      username,
      gender,
      password: hashedpassword,
      picture: gender === "male" ? boypic : girlpic,
    });

    if (newUser) {
      const token = getToken(newUser._id);

      await newUser.save();
      res.status(200).send({
        status: "Success",
        message: "User Signed up successfully ",
        data: {
          _id: newUser._id,
          fullname: newUser.fullname,
          username: newUser.username,
          picture: newUser.picture,
          gender: newUser.gender,
          token: token,
        },
      });
    } else {
      const err = new Error("Invalid User Data");
      err.statusCode = 400;
      throw err;
    }
  } catch (error) {
    next(error);
  }
};
