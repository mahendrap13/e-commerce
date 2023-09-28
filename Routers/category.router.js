import express from "express";
import { addCategory, deleteCategory, getCategory, updateCategory } from "../Controllers/category.controller";
const categoryRouter = express.Router();
categoryRouter.post("/add-category", addCategory);
categoryRouter.get("/get-category", getCategory);
categoryRouter.delete("/delete-category/:categoryId", deleteCategory);
categoryRouter.put("/update-category/:categoryId", updateCategory);

export default categoryRouter;
