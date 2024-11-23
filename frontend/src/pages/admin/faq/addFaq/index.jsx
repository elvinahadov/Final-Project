import React, { useState } from "react";
import useFaqStore from "../../../../store/faqStore";
import { Link } from "react-router-dom";

const AddFaq = () => {
  const { addFaq } = useFaqStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setMessage("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      await addFaq(formData);
      setMessage("FAQ added successfully!");
      setFormData({ title: "", description: "" });
    } catch (error) {
      setMessage("Failed to add FAQ. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-center">Add New FAQ</h1>
          <Link to={"/admin/faq"} className="bg-black text-white py-1 px-2 rounded-lg">Go Back</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-black"
              placeholder="Enter the FAQ title"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-black"
              placeholder="Enter the FAQ description"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add FAQ"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFaq;
