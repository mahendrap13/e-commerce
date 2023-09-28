import productsModel from "../Models/products.Model";
import fs from "fs";
import path from "path";
import { multerFunction } from "../middaleware/multer";

export const addProduct = (req, res) => {
  try {
    // const uploadFile = upload.array("images", 12);
    const uploadFile = multerFunction("./uploads/products").fields([
      { name: "thumbnail" },
      { name: "images", maxCount: 10 },
    ]);
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const {
        name,
        description,
        shortDescription,
        userID,
        categoryID,
        subCategoryID,
        stock,
        price,
        quantity,
      } = req.body;
      let images = [];
      let thumbnail = req.files.thumbnail[0].filename;
      if (req.files !== undefined) {
        for (let i = 0; i < req.files.images.length; i++) {
          images.push(req.files.images[i].filename);
        }
      }
      const addProduct = new productsModel({
        name,
        description,
        shortDescription,
        stock,
        price,
        userID,
        categoryID,
        subCategoryID,
        thumbnail,
        images,
        quantity,
      });
      addProduct.save();
      if (addProduct) {
        res.status(200).json({
          data: addProduct,
          message: "Product Added Successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getProduct = async (req, res) => {
  try {
    const getProduct = await productsModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryID",
          foreignField: "_id",
          as: "categoryID",
        },
      },
      { $unwind: "$categoryID" },
      {
        $lookup: {
          from: "users",
          localField: "userID",
          foreignField: "_id",
          as: "userID",
        },
      },
      { $unwind: "$userID" },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategoryID",
          foreignField: "_id",
          as: "subCategoryID",
        },
      },
      { $unwind: "$subCategoryID" },
    ]);
    if (getProduct) {
      res.status(200).json({
        data: getProduct,
        message: "Product Found Successfully",
        path: process.env.BASE_URL + "/uploash/products",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const uploadFile = multerFunction("./uploads/products").fields([
      { name: "thumbnail" },
      { name: "images", maxCount: 5 },
    ]);
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      if (req.files.image || req.files.thumbnail) {
        let images = [];
        let thumbnail = "";
        if (req.files !== undefined) {
          for (let i = 0; i < req.files.images.length; i++) {
            images.push(req.files.images[i].filename);
          }
          thumbnail = req.files.thumbnail[0].filename;
        }
      }

      const productID = req.params.product_id;
      const updateProduct = await productsModel.updateOne(
        { _id: productID },
        {
          $set: {
            ...req.body,
          },
        }
      );
      if (updateProduct.acknowledged) {
        res.status(200).json({
          data: updateProduct,
          message: "Product Added Successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleteProduct = await productsModel.findByIdAndDelete(
      req.params.product_id
    );
    if (deleteProduct) {
      if (fs.existsSync("./uploads/products/" + deleteProduct.thumbnail)) {
        fs.unlinkSync("./uploads/products/" + deleteProduct.thumbnail);
      }
      deleteProduct.images.forEach((image) => {
        if (fs.existsSync("./uploads/products/" + image)) {
          fs.unlinkSync("./uploads/products/" + image);
        }
      });
    }
    if (deleteProduct) {
      res.status(200).json({
        data: deleteProduct,
        message: "Product Deleted Successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
