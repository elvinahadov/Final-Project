import React, { useEffect, useRef, useState, useCallback } from "react";
import CategoryImg from "../../../assets/images/category.webp";
import { Link, useNavigate } from "react-router-dom";
import useIsVisible from "../../../hooks/useVisible";
import useCategoryStore from "../../../store/categoryStore";
import useProductStore from "../../../store/prodStore";

const ShopByCategory = () => {
  const ref = useRef();
  const isVisible = useIsVisible(ref);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const navigate = useNavigate();

  const { setFilters, getAllProducts } = useProductStore();
  const { categories, loading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setShouldAnimate(isVisible);
  }, [isVisible]);

  const handleCategoryClick = (categoryId) => {
    setFilters((prevFilters) => {
      if (prevFilters.categoryId !== categoryId) {
        getAllProducts({ categoryId });
        return { ...prevFilters, categoryId };
      }
      return prevFilters;
    });
    navigate(`/shop?category=${categoryId}`, { replace: true });
  };
  return (
    <div
      ref={ref}
      className={`sm:px-2 sm:py-14 md:px-6 md:py-16 lg:px-6 lg:py-20 
      transition-opacity ease-in duration-1000
      ${shouldAnimate ? "opacity-100" : "opacity-0"}`}
    >
      <div className="pb-3 animate-fade-in-left sm:flex-col sm:justify-start sm:items-start sm:gap-3 md:flex md:flex-row md:items-center md:justify-between">
        <p className="font-azeret text-white">SHOP BY CATEGORY</p>
        <Link
          to={"/shop"}
          className="flex justify-start font-azeret text-white tracking-widest hover:tracking-[4px] transition-all duration-300 ease-in-out"
        >
          [ DISCOVER MORE ]
        </Link>
      </div>
      <div
        className="relative sm:h-[498px] md:h-[556px] lg:h-[847px] bg-cover rounded-lg"
        style={{
          backgroundImage: `url(${CategoryImg})`,
          backgroundPosition: "50% center",
        }}
      >
        <div className="absolute flex flex-col bottom-5 lg:bottom-10 items-start justify-start gap-2 left-4">
          {loading ? (
            <p className="text-white">Loading categories...</p>
          ) : error ? (
            <p className="text-white">Error loading categories.</p>
          ) : categories.length > 0 ? (
            categories.map((item) => (
              <button
                key={item._id}
                onClick={() => handleCategoryClick(item._id)}
                className="bg-black bg-opacity-75 rounded-lg p-2 text-white font-azeret hover:bg-black"
              >
                {item.name}
              </button>
            ))
          ) : (
            <p className="text-white">No categories available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;
