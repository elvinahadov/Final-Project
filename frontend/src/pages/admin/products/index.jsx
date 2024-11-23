import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../../../store/prodStore";

const ProductsPage = () => {
  const { products, getAllProducts, error, loading, deleteProduct } =
    useProductStore();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl lg:min-w-full mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between border-b-2 py-2">
        <h2 className="text-2xl font-bold">Product List</h2>
        <Link
          to={"/admin/products/add"}
          className="py-2 px-4 bg-black text-white text-center rounded-lg"
        >
          Add Product
        </Link>
      </div>

      <ul className="space-y-4">
        {products.length === 0 ? (
          <li className="text-center py-4">No products available</li>
        ) : (
          products.map((product) => (
            <li
              key={product._id}
              className="flex flex-col sm:flex-row items-center justify-between p-4 border-b sm:space-x-4 sm:space-y-0 sm:items-start"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-center">
                <img
                  src={
                    product.productPhoto ? product.productPhoto.secure_url : ""
                  }
                  alt={product.name}
                  className="w-16 h-16 object-cover mb-2 sm:mb-0 sm:mr-4 rounded-md"
                />
                <div className="text-center sm:text-left">
                  <span className="font-semibold">{product.name}</span>
                  <div className="text-xl font-bold">${product.price}</div>
                  <div className="text-sm">Stock: {product.inStock}</div>
                </div>
              </div>

              <div className="mt-2 sm:pt-10 md:pt-0 flex space-x-3 sm:flex-col sm:items-end sm:gap-4">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <Link
                  to={`/admin/products/edit/${product._id}`}
                  className="text-white bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ProductsPage;
