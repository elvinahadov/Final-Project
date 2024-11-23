import React, { useEffect } from "react";
import useBrandStore from "../../../store/brandStore.js";
import { Link } from "react-router-dom";

const Brands = () => {
  const { fetchBrands, brands, loading, error, deleteBrand } = useBrandStore();

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl lg:min-w-full mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between border-b-2 py-2">
      <h2 className="text-2xl font-bold">Brands</h2>
      <Link to={"/admin/brands/add"} className="py-2 px-4 bg-black text-white rounded-lg">Add Brand</Link>
      </div>

      <ul className="space-y-4">
        {brands.map((brand) => (
          <li
            key={brand._id}
            className="flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center">
              <img
                src={brand.secure_url}
                alt={brand.name}
                className="w-16 h-16 object-cover mr-4 rounded"
              />
              <span className="font-semibold">{brand.name}</span>
            </div>
            <div>
              <button
                className="md:scale-100 bg-red-600 py-2 px-4 text-white rounded-lg sm:scale-75"
                onClick={() => deleteBrand(brand._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Brands;
