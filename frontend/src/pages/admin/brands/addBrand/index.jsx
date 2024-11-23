import React, { useState } from "react";
import useBrandStore from "../../../../store/brandStore.js";
import { Link } from "react-router-dom";

const AddBrand = () => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const { addBrand, error } = useBrandStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!logo) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("logo", logo);

    try {
      await addBrand(formData);
      setName("");
      setLogo(null);
    } catch (err) {
      console.error("Failed to add brand:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <Link to={"/admin/brands"} className="bg-black text-white px-4 py-2 rounded-lg absolute top-0 right-0">Go back</Link>
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md font-azeret">
        <h2 className="text-2xl font-bold mb-4">Add New Brand</h2>
        {error && <p className="text-red-500">{error}</p>}{" "}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black">Brand Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black">Brand Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded transition duration-300"
          >
            Add Brand
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBrand;