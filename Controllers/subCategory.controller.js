import subCategoryModel from "../Models/subCategory.model";
import fs from "fs";
import { multerFunction } from "../middaleware/multer";

export const addsubCategory = async (req, res) => {
  try {
    const uploadFile = multerFunction("./uploads/subCategory").single("image");
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400), json({ message: err.message });
      const { name, description, categoryID } = req.body;
      let image = "";
      if (req.file !== undefined) {
        image = req.file.filename;
      }
      const subCategory = new subCategoryModel({
        name: name,
        description: description,
        image: image,
        categoryID: categoryID,
      });
      await subCategory.save();
      if (subCategory) {
        return res.status(200).json({
          dtat: subCategory,
          message: "Sub Category Added Successfully",
          path: process.env.BASE_URL + "/uploads/subCategory",
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
export const getsubCategory = async (req, res) => {
  try {
    const subCategory = await subCategoryModel.find().populate("categoryID");
    // .aggregate([
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "categoryID",
    //       foreignField: "_id",
    //       as: "category",
    //     },
    //   },
    //   {
    //     $unwind: "$category",
    //   },
    // ]);

    if (subCategory) {
      return res.status(200).json({
        dtat: subCategory,
        message: "Sub Category List",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const uploadFile = multerFunction("./uploads/subCategory").single("image");
    uploadFile(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const ID = req.params.category_id;
      const { name, description } = req.body;
      const dataCategory = await subCategoryModel.findOne({ _id: ID });
      let image = dataCategory.image;

      if (req.file !== undefined) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/subCategory/" + dataCategory.image)) {
          fs.unlinkSync("./uploads/subCategory/" + dataCategory.image);
        }
      }
      const updateCategory = await subCategoryModel.updateOne(
        { _id: ID },
        {
          $set: {
            name: name,
            description: description,
            image: image,
          },
        }
      );

      if (updateCategory.acknowledged) {
        return res.status(200).json({
          data: updateCategory,
          message: "Sub Category Updated Successfully",
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const ID = req.params.category_id;
    const dataCategory = await subCategoryModel.findOne({ _id: ID });

    const deleteCategory = await subCategoryModel.deleteOne({ _id: ID });
    if (deleteCategory.acknowledged) {
      if (fs.existsSync("./uploads/subCategory/" + dataCategory.image)) {
        fs.unlinkSync("./uploads/subCategory/" + dataCategory.image);
      }
      return res.status(200).json({
        data: deleteCategory,
        message: "Sub Category Deleted Successfully",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
