import React from "react";
import { Link } from "react-router-dom";

const SingleProduct = ({ product, width, height }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div
        className={` sm:px-[3px] sm:py-2.5 relative`}
      >
        <div className="relative overflow-hidden bg-cover bg-no-repeat w-full h-full rounded-md">
          <img
            src={product.productPhoto.secure_url}
            alt=""
            className={`${width} ${height} object-cover transition duration-300 ease-in-out hover:scale-110 rounded-md`}
          />
          {product.onSale && (
            <div className="border-[1px] bg-opacity-100 px-2 border-black rounded-[3px] absolute top-2 left-2 text-black font-azeret">
              SALE
            </div>
          )}
        </div>
        <div className="py-2">
          <div>
            <p className="font-azeret text-white text-[16px]">{product.name}</p>
            {product.onSale ? (
              <div className="flex items-center gap-3">
                <p className="font-azeret text-gray-700 font-bold text-[16px] line-through">
                  ${product.price}
                </p>
                <p className="font-azeret text-white text-[16px]">
                  ${product.price - (product.price * product.sale) / 100}
                </p>
              </div>
            ) : (
              <p className="font-azeret text-white text-[16px]">
                ${product.price}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SingleProduct;