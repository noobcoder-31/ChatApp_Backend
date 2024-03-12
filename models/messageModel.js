import mongoose from "mongoose";

const messageschema = new mongoose.Schema(
  {
    senderid: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recieverid: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const message = mongoose.model("Message", messageschema);
export default message;
