import mongoose from "mongoose";
import category from "./category.model";
const Subschema = mongoose.Schema;

const subCategoryModel = new Subschema({
  categoryID: {
    type: Subschema.Types.ObjectId,
    ref: category,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
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

export default mongoose.model("SubCategory", subCategoryModel);
