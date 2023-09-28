import categoryModel from "../Models/category.model";
import fs from "fs";
import { multerFunction } from "../middaleware/multer";

export const addCategory = (req, res) => {
  try {
    const uploadFile = multerFunction("./uploads/category").single("image");
    uploadFile(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const { name, description } = req.body;
      let image = "";
      if (req.file !== undefined) {
        image = req.file.filename;
      }
      const newCategory = new categoryModel({
        name: name,
        description: description,
        image: image,
      });
      newCategory.save();
      if (newCategory) {
        return res.status(200).json({
          data: newCategory,
          message: "Category Added Successfully",
          path: process.env.BASE_URL + "/uploads/category",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getCategory = async (req, res) => {
  try {
    const category = await categoryModel.find();
    if (category) {
      return res.status(200).json({
        data: category,
        message: "Fetch Category List",
        path: process.env.BASE_URL + "/uploads/category",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const ID = req.params.categoryId;
    const categoryData = await categoryModel.findOne({ _id: ID });
    if (categoryData.image !== "") {
      if (fs.existsSync("./uploads/category/" + categoryData.image)) {
        fs.unlinkSync("./uploads/category/" + categoryData.image);
      }
    }
    const category = await categoryModel.deleteOne({ _id: ID });
    return res.status(200).json({
      data: category,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const uploadFile = multerFunction("./uploads/category").single("image");
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const ID = req.params.categoryId;

      const { name, description } = req.body;

      const categoryData = await categoryModel.findOne({ _id: ID });

      let image = categoryData.image;
      if (req.file !== undefined) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/category/" + categoryData.image)) {
          fs.unlinkSync("./uploads/category/" + categoryData.image);
        }
      }
      const newCategory = await categoryModel.updateOne(
        { _id: ID },
        {
          $set: {
            name: name,
            description: description,
            image: image,
          },
        }
      );
      if (newCategory.acknowledged) {
        return res.status(201).json({
          data: newCategory,
          message: "Category Updated Successfully",
          path: process.env.BASE_URL + "/uploads/category",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
