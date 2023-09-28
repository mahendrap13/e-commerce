import express from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../Controllers/product.controller";
const productrouter = express.Router();

productrouter.post("/add-product", addProduct);
productrouter.get("/get-product", getProduct);
productrouter.put("/update-product/:product_id", updateProduct);
productrouter.delete("/delete-product/:product_id", deleteProduct);
export default productrouter;
