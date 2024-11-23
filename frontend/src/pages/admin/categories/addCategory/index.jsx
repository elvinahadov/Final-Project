import React, { useState } from "react";
import { Link } from "react-router-dom";
import useCategoryStore from "../../../../store/categoryStore";

const AddCategory = () => {
  const [name, setName] = useState("");
  const { addCategory, error } = useCategoryStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryData = { name };

    try {
      await addCategory(categoryData);
      setName("");
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Link
        to={"/admin/categories"}
        className="bg-black text-white px-4 py-2 rounded-lg absolute top-0 right-0"
      >
        Go back
      </Link>
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md font-azeret">
        <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded transition duration-300"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
