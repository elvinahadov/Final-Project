import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SingleProduct from "../../SingleProduct/index.jsx";
import useProductStore from "../../../store/prodStore";

const ProductsSec = () => {
  const { getAllProducts, products } = useProductStore();

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="w-full mx-auto py-[70px]">
      <div className="pb-3 lg:px-6 md:px-6 animate-fade-in-left sm:flex-col sm:justify-start sm:items-start sm:pl-2 sm:gap-3 md:flex md:flex-row md:items-center md:justify-between">
        <p className="font-azeret text-white">TRENDING NOW</p>
        <Link
          to={"/shop"}
          className="flex justify-start font-azeret text-white tracking-widest hover:tracking-[4px] transition-all duration-300 ease-in-out"
        >
          [ DISCOVER MORE ]
        </Link>
      </div>
      <div className="flex items-center justify-center flex-wrap sm:max-w-[375px] md:max-w-[1024px] lg:max-w-full">
        {/* İlk 4 ürünü map ile render et */}
        {products.slice(0, 4).map((product) => (
          <SingleProduct
            key={product._id}
            product={product}
            width="sm:w-[364px] md:w-[494px] lg:w-[456px]"
            height="sm:h-[250px] md:h-[350px] lg:h-[400px]"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsSec;
