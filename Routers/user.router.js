import express from "express";
import auth from "../middaleware/auth.middleware";
import {
  getUser,
  sendotp,
  signInuser,
  signWithopt,
  signupuser,
  updateUserData,
} from "../Controllers/user.controller";

const UserRouter = express.Router();
UserRouter.post("/user-signup", signupuser);
UserRouter.post("/user-signin", signInuser);
UserRouter.post("/user-sendotp", sendotp);
UserRouter.post("/user-signwithotp", signWithopt);
UserRouter.put("/user-update/:user_id", updateUserData);
UserRouter.get("/get-user", getUser);

export default UserRouter;
