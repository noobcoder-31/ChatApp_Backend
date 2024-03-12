import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModle.js";
import { getReceiverSocketId, io } from "../socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const senderid = req.user._id;
    const { id: recieverid } = req.params;

    if (!message) {
      throw new Error("message ot found");
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderid, recieverid] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderid, recieverid],
      });
      await User.findOneAndUpdate(
        { _id: senderid },
        { $push: { connectedWith: recieverid } }
      );

      await User.findOneAndUpdate(
        { _id: recieverid },
        { $push: { connectedWith: senderid } }
      );
    }
    const newMessage = new Message({
      senderid,
      recieverid,
      message,
    });

    if (!newMessage) {
      throw new Error(`Couldn't create message`);
    }
    conversation.message.push(newMessage);
    // await conversation.save();
    // await newMessage.save();

    await Promise.all([conversation.save(), newMessage.save()]);
    const receiverSocketId = getReceiverSocketId(recieverid);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({
      status: "success",
      message: "Message send Successfully",
      newMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const { id: recieverid } = req.params;
    const senderid = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderid, recieverid] },
    }).populate("message");

    if (!conversation) {
      throw new Error(`Couldn't find conversation between the Users`);
    }

    res.status(200).json({
      status: "success",
      data: conversation.message,
    });
  } catch (error) {
    next(error);
  }
};
