import express from "express";
import {
  addCart,
  deleteCart,
  getCart,
  updateCart,
} from "../Controllers/cart.controller";
const cartRouter = express.Router();
cartRouter.post("/add-cart", addCart);
cartRouter.get("/get-cart", getCart);
cartRouter.delete("/delete-cart/:cart_id", deleteCart);
cartRouter.put("/update-cart/:cart_id", updateCart);
export default cartRouter;
