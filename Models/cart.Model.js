import mongoose from "mongoose";
import userModel from "./user.model";
import productsModel from "./products.Model";
const schema = mongoose.Schema;
const cardModel = schema({
  name: {
    type: String,
    required: true,
  },
  productID: {
    type: schema.Types.ObjectId,
    ref: userModel,
    required: true,
  },
  userID: {
    type: schema.Types.ObjectId,
    ref: productsModel,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
  creatAt: {
    type: Date,
    default: Date.now(),
  },
});
export default mongoose.model("cart", cardModel);
