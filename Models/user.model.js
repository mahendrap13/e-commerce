import mongoose from "mongoose";
const Uschema = mongoose.Schema;

const   UserSchema = new Uschema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  otp: {
    type: Number,
    default: null,
  },
  status: {
    type: Number,
    default: 1,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Users", UserSchema);
