import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import UserRouter from "./Routers/user.router";
import categoryRouter from "./Routers/category.router";
import subCategoryRouter from "./Routers/subCategory.router";
import productrouter from "./Routers/product.router";
import cartRouter from "./Routers/cart.router";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.static(__dirname));
app.use(cookieParser());
app.use(cors());
app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.BASE_URL}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/ECommerce")
  .then(() => console.log("DB connection established"))
  .catch((error) => console.log(error));

app.use(
  UserRouter,
  categoryRouter,
  subCategoryRouter,
  productrouter,
  cartRouter
);
