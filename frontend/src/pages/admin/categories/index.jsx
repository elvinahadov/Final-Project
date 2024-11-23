import React, { useEffect } from "react";
import useCategoryStore from "../../../store/categoryStore.js";
import { Link } from "react-router-dom";

const Categories = () => {
  const { fetchCategories, categories, loading, error, deleteCategory } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl lg:min-w-full mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between border-b-2 py-2">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Link
          to={"/admin/categories/add"}
          className="py-2 px-4 bg-black text-white rounded-lg"
        >
          Add Category
        </Link>
      </div>

      <ul className="space-y-4">
        {categories.map((category) => (
          <li
            key={category._id}
            className="flex items-center justify-between p-4 border-b"
          >
            <span className="font-semibold">{category.name}</span>
            <button
              className="md:scale-100 bg-red-600 py-2 px-4 text-white rounded-lg sm:scale-75"
              onClick={() => deleteCategory(category._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
