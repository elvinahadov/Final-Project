import mongoose from "mongoose";

const faqSchema = mongoose.Schema([
  {
    title: { type: String },
    description: { type: String },
  },
]);

export const FAQ = mongoose.model("FAQ", faqSchema);
