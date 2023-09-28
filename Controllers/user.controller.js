import userModel from "../Models/user.model";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import hbs from "nodemailer-express-handlebars";
import { multerFunction } from "../middaleware/multer";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const getUserData = await userModel.find();
    if (getUserData) {
      return res.status(200).json({
        data: getUserData,
        message: "User Account Feached Successfully",
        path: process.env.BASE_URL + "/uploads/user/",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const signupuser = (req, res) => {
  try {
    const uploadFile = multerFunction("./uploads/user").single("avatar");

    uploadFile(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const { name, email, password, contact, username, role } = req.body;

      let image = "";
      if (req.file !== undefined) {
        image = req.file.filename;
      }
      const newPassword = bcrypt.hashSync(password, 10);
      const newUser = new userModel({
        name: name,
        email: email,
        password: newPassword,
        contact: contact,
        username: username,
        role: role,
        avatar: image,
      });
      newUser.save();
      if (newUser.acknowledge) {
        return res.status(200).json({
          data: newUser,
          message: "User Account Created Successfully",
          // path: process.env.BASE_URL+'/uoloads,
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const signInuser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const getUser = await userModel.findOne({
      $or: [
        { email: email },
        { username: username },
        { email: email, username: username },
      ],
    });
    if (!getUser) {
      return res.status(400).json({
        message: "invalid email",
      });
    }
    const newPassword = bcrypt.compareSync(password, getUser.password);
    if (!newPassword) {
      return res.status(400).json({
        message: "invalid password ",
      });
    }

    const token = jwt.sign(
      { userid: getUser._id, email: getUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    // console.log(token);

    // res.cookie("getuser", getUser);
    // res.status(200).json({
    //   token: token,
    //   data: getUser,
    //   message: "Successfully login",
    // });
    // console.log(req.cookie.getUser);

    return res.status(200).json({
      data: getUser,
      message: "User Account Login Successfully",
      path: process.env.BASE_URL + "/uploads/user/",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const sendotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const getUser = await userModel.findOne({ email: email });

    if (!getUser) {
      return res.status(400).json({
        message: "invalid email",
      });
    }

    const mainotp = parseInt(Math.random() * 1000000);

    const Updateotp = await userModel.updateOne(
      { _id: getUser._id },
      { $set: { otp: mainotp } }
    );

    if (Updateotp.acknowledged) {
      res.status(200).json({
        message: "Send OTP Successfully",
      });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const handlebaroptions = {
      viewEngine: {
        extName: ".handlebars",
        partialsDir: path.resolve(__dirname, "../views"),
        defaultLayout: false,
      },
      viewPath: path.resolve(__dirname, "../views"),
      extName: ".handlebars",
    };
    transporter.use("compile", hbs(handlebaroptions));

    const info = transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: getUser.email, // list of receivers
      subject: "Verify OTP with Email", // Subject line
      text: `${mainotp}`, // plain text body
      // html: ``, // html body
      template: "email",
      context: {
        name: getUser.name,
        username: getUser.username,
        otp: mainotp,
      },
    });
    // console.log("Message sent: %s", info.messageId);
    setTimeout(async () => {
      const nullotp = await userModel.updateOne(
        { _id: getUser._id },
        { $set: { otp: null } }
      );
    }, 120000);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const signWithopt = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (req.body.otp === null) {
      return res.status(404).json({
        message: "This is not OTP",
      });
    }
    const getUser = await userModel.findOne({ email: email, otp: otp });
    if (!getUser) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }

    if (getUser) {
      return res.status(200).json({
        data: getUser,
        message: "User Account Login Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUserData = async (req, res) => {
  try {
    const uploadFile = multerFunction("./uploads/user").single("avatar");
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const UserID = req.params.user_id;
      const { username, name, password, role, contact } = req.body;
      const userData = await userModel.findOne({ _id: UserID });
      let image = userData.avatar;

      if (req.file !== undefined) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/user/" + userData.avatar)) {
          fs.unlinkSync("./uploads/user/" + userData.avatar);
        }
      }
      let newPassword = userData.password;
      if (req.body.password) {
        newPassword = bcrypt.hashSync(password, 10);
      }

      const updateUser = await userModel.updateOne(
        { _id: UserID },
        {
          $set: {
            username: username,
            name: name,
            password: newPassword,
            role: role,
            contact: contact,
            avatar: image,
          },
        }
      );
      if (updateUser.acknowledged) {
        res.status(201).json({
          data: updateUser,
          message: "User Account Updated Successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// export const signupuser = async (req, res) => {
//   try {
//     const { name, email, password, contact, username, role } = req.body;
//     const getUser = await userModel.findOne({
//       $or: [
//         { email: email },
//         { username: username },
//         { email: email, username: username },
//       ],
//     });
//     if (getUser) {
//       return res.status(400).json({
//         message: "User already Exist",
//       });
//     }
//     const newPassword = bcrypt.hashSync(password, 10);
//     const newUser = new userModel({
//       name: name,
//       email: email,
//       password: newPassword,
//       contact: contact,
//       username: username,
//       role: role,
//     });
//     newUser.save();
//     if (newUser) {
//       return res.status(200).json({
//         data: newUser,
//         message: "User Account Created Successfully",
//         path: process.env.BASE_URL,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// export const updateUserData = async (req, res) => {
//   try {
//     const UserID = req.params.user_id;
//     const { username, name, email, password, role, contact } = req.body;
//     const getuser = await userModel.findOne({ _id: UserID });

//     if (!getuser) {
//       return res.status(400).json({
//         message: "invalid user id",
//       });
//     }

//     const Newpassword = bcrypt.hashSync(password, 10);
//     const Updateuser = await userModel.updateOne(
//       { _id: UserID },
//       {
//         $set: {
//           username: username,
//           name: name,
//           password: Newpassword,
//           role: role,
//           contact: contact,
//         },
//       }
//     );
//     if (Updateuser.acknowledged) {
//       return res.status(200).json({
//         data: Updateuser,
//         message: "User Account Updated Successfully",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
