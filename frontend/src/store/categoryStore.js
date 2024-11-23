import { toast } from "react-toastify";
import { create } from "zustand";

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      set({ categories: data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(error);
      toast.error("Failed to load categories.");
    }
  },

  addCategory: async (categoryData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        throw new Error("Failed to add category");
      }
      const newCategory = await response.json();
      set((state) => ({
        categories: [...state.categories, newCategory],
        loading: false,
      }));
      toast.success("Category added successfully!");
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(error);
      toast.error("Failed to add category.");
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:6262/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      set((state) => ({
        categories: state.categories.filter((category) => category._id !== id),
        loading: false,
      }));
      toast.success("Category deleted successfully!");
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error(error);
      toast.error("Failed to delete category.");
    }
  },
}));

export default useCategoryStore;
