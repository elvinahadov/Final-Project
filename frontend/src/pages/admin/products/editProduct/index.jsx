import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useCategoryStore from "../../../../store/categoryStore";
import useBrandStore from "../../../../store/brandStore";
import useProductStore from "../../../../store/prodStore";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    categories,
    fetchCategories,
    loading: loadingCategories,
    error: categoryError,
  } = useCategoryStore();
  const {
    brands,
    fetchBrands,
    loading: loadingBrands,
    error: brandError,
  } = useBrandStore();
  const {
    getProductById,
    updateProduct,
    loading: loadingProduct,
    error: productError,
  } = useProductStore();

  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [productData, setProductData] = useState({
    name: "",
    categoryId: "",
    brandId: "",
    description: "",
    productInfo: "",
    price: "",
    color: "",
    inStock: 0,
    onSale: false,
    sale: 0,
    isBestseller: false,
    productPhoto: null,
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    getProductById(id).then((product) => {
      setProductData({
        name: product.name || "",
        categoryId: product.categoryId || "",
        brandId: product.brandId || "",
        description: product.description || "",
        productInfo: product.productInfo || "",
        price: product.price || "",
        color: product.color || "",
        inStock: product.inStock || 0,
        onSale: product.onSale || false,
        sale: product.sale || 0,
        isBestseller: product.isBestseller || false,
        productPhoto: product.productPhoto || null,
      });
      setImagePreview(product.productPhoto?.secure_url || "");
    });
  }, [fetchCategories, fetchBrands, getProductById, id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProductData = { ...productData };
    if (!image && productData.productPhoto) {
      updatedProductData.productPhoto = {
        secure_url: productData.productPhoto.secure_url,
        public_id: productData.productPhoto.public_id,
      };
    }

    try {
      await updateProduct(id, updatedProductData, image);
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
        <Link
          to="/admin/products"
          className="bg-black text-white py-1 px-3 rounded-lg"
        >
          Go back
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Product Info */}
        <div>
          <label className="block font-semibold">Product Info</label>
          <textarea
            name="productInfo"
            value={productData.productInfo}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Product Price */}
        <div>
          <label className="block font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold">Category</label>
          <select
            name="categoryId"
            value={productData.categoryId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select a category</option>
            {loadingCategories ? (
              <option>Loading...</option>
            ) : (
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block font-semibold">Brand</label>
          <select
            name="brandId"
            value={productData.brandId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select a brand</option>
            {loadingBrands ? (
              <option>Loading...</option>
            ) : (
              brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="block font-semibold">Stock Quantity</label>
          <input
            type="number"
            name="inStock"
            value={productData.inStock}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block font-semibold">Color</label>
          <input
            type="text"
            name="color"
            value={productData.color}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* On Sale */}
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="onSale"
              checked={productData.onSale}
              onChange={handleInputChange}
              className="mr-2"
            />
            On Sale
          </label>
        </div>

        {/* Sale Percentage */}
        <div>
          <label className="block font-semibold">Sale Percentage</label>
          <input
            type="number"
            name="sale"
            value={productData.sale}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            disabled={!productData.onSale}
          />
        </div>

        {/* Best Seller */}
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isBestseller"
              checked={productData.isBestseller}
              onChange={handleInputChange}
              className="mr-2"
            />
            Best Seller
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-semibold">Upload Image</label>
          <input
            type="file"
            name="productPhoto"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-md"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Selected"
              className="mt-2 w-32 h-32 object-cover border rounded-md"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-black text-white rounded-md"
          disabled={loadingProduct}
        >
          {loadingProduct ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;