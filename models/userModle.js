import mongoose from "mongoose";

const schema = mongoose.Schema;

const userSchema = new schema(
  {
    fullname: {
      type: "string",
      required: true,
    },
    username: {
      type: "string",
      required: true,
    },
    gender: {
      type: "string",
      required: true,
      enum: ["male", "female"],
    },
    password: {
      type: "string",
      minlength: 6,
      required: true,
    },
    picture: {
      type: "string",
      default: "",
    },
    connectedWith: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
