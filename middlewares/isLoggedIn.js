import jwt from "jsonwebtoken";
import User from "../models/userModle.js";

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Token Not Found!! Authorization Revoked");
    }
    const isValid = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!isValid) {
      throw new Error("Token Expired!! Authorization Revoked");
    }

    const user = await User.findById(isValid.id).select("-password");
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default isLoggedIn;
