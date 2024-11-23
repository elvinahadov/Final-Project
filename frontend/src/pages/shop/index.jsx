import React, { useState, useEffect } from "react";
import useProductStore from "../../store/prodStore";
import useCategoryStore from "../../store/categoryStore";
import useBrandStore from "../../store/brandStore";
import SingleProduct from "../../components/SingleProduct";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useLocation, useNavigate } from "react-router-dom";

function valuetext(value) {
  return `$${value}`;
}

const Shop = () => {
  const { products, loading, error, getAllProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { brands, fetchBrands } = useBrandStore();

  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");
  const brandFromQuery = queryParams.get("brand");
  const minPriceFromQuery = queryParams.get("minPrice") || 0;
  const maxPriceFromQuery = queryParams.get("maxPrice") || 10000;
  const bestsellersFromQuery = queryParams.get("bestsellers") === "true";
  const onSaleFromQuery = queryParams.get("onSale") === "true";

  const [filters, setFilters] = useState({
    brandId: brandFromQuery || "",
    categoryId: categoryFromQuery || "",
    bestsellers: bestsellersFromQuery,
    onSale: onSaleFromQuery,
    minPrice: parseInt(minPriceFromQuery),
    maxPrice: parseInt(maxPriceFromQuery),
    sortBy: "price",
    sortOrder: "asc",
  });

  const [tempFilters, setTempFilters] = useState({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (filters) {
      getAllProducts(filters);
      const params = new URLSearchParams();
      if (filters.categoryId) params.set("category", filters.categoryId);
      if (filters.brandId) params.set("brand", filters.brandId);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.bestsellers) params.set("bestsellers", filters.bestsellers);
      if (filters.onSale) params.set("onSale", filters.onSale);
      navigate(`?${params.toString()}`);
    }
  }, [filters, getAllProducts, navigate]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceChange = (event, newValue) => {
    setTempFilters({
      minPrice: newValue[0],
      maxPrice: newValue[1],
    });
  };

  const handlePriceCommitted = (event, newValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      minPrice: newValue[0],
      maxPrice: newValue[1],
    }));
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split(":");
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortBy,
      sortOrder,
    }));
  };

  const handleCategoryClick = (categoryId) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      categoryId,
    }));
  };

  const handleBrandClick = (brandId) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      brandId,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      brandId: "",
      categoryId: "",
      bestsellers: false,
      onSale: false,
      minPrice: 0,
      maxPrice: 10000,
      sortBy: "price",
      sortOrder: "asc",
    });
    setTempFilters({
      minPrice: 0,
      maxPrice: 10000,
    });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white font-azeret flex items-center justify-center text-[100px]">
        Loading products...
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-black font-azeret">
      <div className="flex flex-col md:flex-row bg-black pt-20 flex-grow my-10">
        {/* Left side filters */}
        <div className="max-w-[240px] md:w-1/4 p-4 bg-black text-white">
          <h2 className="text-sm font-semibold mb-4 pb-2 border-b-[1px]">
            Browse By
          </h2>

          {/* All Products Link */}
          <div className="mb-4">
            <span
              onClick={handleResetFilters}
              className="cursor-pointer block p-2 hover:text-gray-500 text-gray-500"
            >
              All Products
            </span>
          </div>

          {/* Brands Filter */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Brands</h3>
            <div className="space-y-2">
              <span
                onClick={() => handleBrandClick("")}
                className={`cursor-pointer block p-2 hover:text-gray-500 ${
                  filters.brandId === "" ? "text-gray-500" : "text-white"
                }`}
              >
                All Brands
              </span>
              {brands.map((brand) => (
                <span
                  key={brand._id}
                  onClick={() => handleBrandClick(brand._id)}
                  className={`cursor-pointer block p-2 hover:text-gray-500 ${
                    filters.brandId === brand._id
                      ? "text-gray-500"
                      : "text-white"
                  }`}
                >
                  {brand.name}
                </span>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              <span
                onClick={() => handleCategoryClick("")}
                className={`cursor-pointer block p-2 hover:text-gray-500 ${
                  filters.categoryId === "" ? "text-gray-500" : "text-white"
                }`}
              >
                All Categories
              </span>
              {categories.map((category) => (
                <span
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  className={`cursor-pointer block p-2 hover:text-gray-500 ${
                    filters.categoryId === category._id
                      ? "text-gray-500"
                      : "text-white"
                  }`}
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="bestsellers"
                  checked={filters.bestsellers}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                Bestsellers
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="onSale"
                  checked={filters.onSale}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                On Sale
              </label>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Price</h3>
            <Box>
              <Slider
                value={[tempFilters.minPrice, tempFilters.maxPrice]}
                onChange={handlePriceChange}
                onChangeCommitted={handlePriceCommitted}
                valueLabelDisplay="auto"
                valueLabelFormat={valuetext}
                min={0}
                max={10000}
                step={10}
                sx={{
                  color: "white",
                  "& .MuiSlider-thumb": {
                    backgroundColor: "white",
                  },
                }}
              />
            </Box>
          </div>
        </div>

        {/* Products Section */}
        <div className="flex-1 py-10">
          {/* Sorting Section */}
          <div className="flex justify-end mb-4">
            <select
              name="sortBy"
              onChange={handleSortChange}
              value={`${filters.sortBy}:${filters.sortOrder}`}
              className="bg-black text-white p-2"
            >
              <option value="price:asc">Price (Low to High)</option>
              <option value="price:desc">Price (High to Low)</option>
              <option value="name:asc">Name (A to Z)</option>
              <option value="name:desc">Name (Z to A)</option>
            </select>
          </div>

          {/* No Products Found Message */}
          {products.length === 0 ? (
            <div className="text-white text-center">No products found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <SingleProduct key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
