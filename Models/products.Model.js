import mongoose from "mongoose";
import usermodel from "./user.model";
import subcategorymodel from "./subCategory.model";
import categoty from "./category.model";
const Pschema = mongoose.Schema;

const productModel = new Pschema({
  name: {
    type: String,
    required: true,
  },
  userID: {
    type: Pschema.Types.ObjectId,
    ref: usermodel,
    required: true,
  },
  categoryID: {
    type: Pschema.Types.ObjectId,
    ref: categoty,
    required: true,
  },
  subCategoryID: {
    type: Pschema.Types.ObjectId,
    ref: subcategorymodel,
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
  images: {
    type: Array,
    default: null,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    default: "In Stock",
  },
  shortDescription: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
export default mongoose.model("products", productModel);
