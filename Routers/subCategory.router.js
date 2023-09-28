import express from "express";
import {
  addsubCategory,
  deleteCategory,
  getsubCategory,
  updateCategory,
} from "../Controllers/subCategory.controller";
const subCategoryRouter = express.Router();

subCategoryRouter.post("/add-subcategory", addsubCategory);
subCategoryRouter.get("/get-subcategory", getsubCategory);
subCategoryRouter.put("/update-subcategory/:category_id", updateCategory);
subCategoryRouter.delete("/delete-subcategory/:category_id", deleteCategory);
export default subCategoryRouter;
