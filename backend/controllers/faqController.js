import { FAQ } from "../models/faqModel.js";

export const getFaq = async (req, res) => {
  try {
    const faq = await FAQ.find();
    res.status(200).json({ message: "FAQs found", data: faq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addFaq = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(500).send({ message: "Please fill al required fields" });
    return;
  }
  try {
    const newFaq = new FAQ(req.body);
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    res.status(200).json({ message: "FAQ deleted successfully", faq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSingleFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findById(id);

    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    res.status(200).json({ message: "Product found", data: faq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const editFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFaq = await FAQ.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedFaq) return res.status(404).json({ message: "FAQ not found" });

    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
