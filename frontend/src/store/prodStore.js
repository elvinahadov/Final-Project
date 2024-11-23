import { toast } from "react-toastify";
import { create } from "zustand";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  filter: {
    brandId: null,
    categoryId: null,
    minPrice: null,
    maxPrice: null,
    bestsellers: false,
    onSale: false,
    sortBy: "price",
    sortOrder: "asc",
  },

  getAllProducts: async (filters = {}) => {
    set({ loading: true, error: null });

    // Build query parameters from filters
    const queryParams = new URLSearchParams();
    if (filters.brandId) queryParams.append("brandId", filters.brandId);
    if (filters.categoryId)
      queryParams.append("categoryId", filters.categoryId);
    if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
    if (filters.bestsellers)
      queryParams.append("bestsellers", filters.bestsellers);
    if (filters.onSale) queryParams.append("onSale", filters.onSale);
    if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

    try {
      const response = await fetch(
        `http://localhost:6262/api/products?${queryParams.toString()}`
      );
      const data = await response.json();

      if (response.ok) {
        set({ products: data.products });
      } else {
        set({ error: data.message });
      }
    } catch (error) {
      set({ error: "Failed to fetch products" });
    } finally {
      set({ loading: false });
    }
  },

  setFilters: (filters) => {
    set((state) => {
      const newFilter = { ...state.filter, ...filters };
      set({ filter: newFilter });
      return newFilter;
    });
  },

  resetFilters: () => {
    set({
      filter: {
        brandId: null,
        categoryId: null,
        minPrice: null,
        maxPrice: null,
        bestsellers: false,
        onSale: false,
        sortBy: "price",
        sortOrder: "asc",
      },
    });
  },

  getProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:6262/api/products/${id}`);
      const data = await response.json();
      if (response.ok) {
        return data.product;
      } else {
        set({ error: data.message });
        throw new Error(data.message);
      }
    } catch (error) {
      set({ error: "Failed to fetch product" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (productData, image) => {
    set({ loading: true, error: null });

    if (!image && !productData.productPhoto) {
      set({ error: "Image is required", loading: false });
      return;
    }

    const formData = new FormData();
    for (let key in productData) {
      formData.append(key, productData[key]);
    }

    if (image) {
      formData.append("productPhoto", image);
    }

    try {
      const response = await fetch("http://localhost:6262/api/products", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        set((state) => ({
          products: [...state.products, data.product],
          successMessage: "Product created successfully",
        }));
        toast.success("Product created successfully.");
      } else {
        set({ error: data.message });
        toast.error("Failed to create product.");
      }
    } catch (error) {
      set({ error: "Failed to create product" });
      toast.error("Failed to create product.");
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, productData, image) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        formData.append(key, productData[key]);
      });

      if (image) {
        formData.append("productPhoto", image);
        if (productData.productPhoto?.public_id) {
          formData.append(
            "oldProductPhotoPublicId",
            productData.productPhoto.public_id
          );
        }
      }

      const response = await fetch(`http://localhost:6262/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        set((state) => ({
          products: state.products.map((p) =>
            p._id === id ? data.product : p
          ),
          product: data.product,
          error: null,
        }));
        toast.success("Product updated successfully.");
      } else {
        set({ error: data.message });
        toast.error("Failed to update product.");
      }
    } catch (error) {
      set({ error: "Server error" });
      toast.error("Failed to update product.");
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:6262/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        set((state) => ({
          products: state.products.filter((product) => product._id !== id),
          successMessage: "Product deleted successfully",
        }));
        toast.success("Product deleted successfully.");
      } else {
        set({ error: data.message });
        toast.error("Failed to delete product.");
      }
    } catch (error) {
      set({ error: "Failed to delete product" });
      toast.error("Failed to delete product.");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProductStore;
