import { Category } from "../models/categoryModel.js";

const getCategories = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json({ message: "Categories found", data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category found", data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Category.findByIdAndDelete(id);

    if (!data) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category deleted successfully", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCategory)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const addCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  getCategories,
  getSingleCategory,
  deleteCategory,
  editCategory,
  addCategory,
};