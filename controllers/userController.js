import Conversation from "../models/conversationModel.js";
import User from "../models/userModle.js";

export const getUsers = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;

    const loggedInUser = await User.findById(loggedInUserId);

    const connectedUserIds = loggedInUser.connectedWith;

    const connectedUsers = await User.find({
      _id: { $in: connectedUserIds },
    })
      .select("-password")
      .select("-connectedWith");

    res.status(200).json({
      status: "success",
      connectedUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const loggedInUserId = req.user._id;
    const foundUser = await User.findOne({ username })
      .select("-password")
      .select("-connectedWith");

    if (!foundUser) {
      throw new Error("User not found");
    }

    const foundUserId = foundUser?._id;

    if (!foundUserId || foundUserId === loggedInUserId) {
      throw new Error("User not found");
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [loggedInUserId, foundUserId] },
    });

    if (conversation) {
      throw new Error("User already exists");
    }

    await User.findOneAndUpdate(
      { _id: loggedInUserId },
      { $push: { connectedWith: foundUserId } }
    );

    await User.findOneAndUpdate(
      { _id: foundUserId },
      { $push: { connectedWith: loggedInUserId } }
    );

    conversation = await Conversation.create({
      participants: [loggedInUserId, foundUserId],
    });

    await conversation.save();
    const loggedInUser = await User.findById(loggedInUserId);
    const connectedUserIds = loggedInUser.connectedWith;
    const connectedUsers = await User.find({
      _id: { $in: connectedUserIds },
    })
      .select("-password")
      .select("-connectedWith");

    res.status(200).json({
      status: "success",
      Message: "User found successfully",
      connectedUsers,
    });
  } catch (error) {
    next(error);
  }
};
