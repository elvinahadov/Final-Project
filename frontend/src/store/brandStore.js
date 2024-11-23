import { create } from "zustand";
import { toast } from "react-toastify"; // Import toast

const useBrandStore = create((set) => ({
  brands: [],
  loading: false,
  error: null,

  fetchBrands: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/brands");
      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }
      const data = await response.json();
      set({ brands: data.brands, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(error);
    }
  },

  addBrand: async (brandData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/brands", {
        method: "POST",
        body: brandData,
      });
      if (!response.ok) {
        throw new Error("Failed to add brand");
      }
      const newBrand = await response.json();
      set((state) => ({
        brands: [...state.brands, newBrand.brand],
        loading: false,
      }));

      toast.success("Brand added successfully!");
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(error);

      toast.error("Failed to add brand.");
    }
  },

  deleteBrand: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:6262/api/brands/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete brand");
      }
      set((state) => ({
        brands: state.brands.filter((brand) => brand._id !== id),
        loading: false,
      }));
      toast.success("Brand deleted successfully!");
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(error);
      toast.error("Failed to delete brand.");
    }
  },
}));

export default useBrandStore;
