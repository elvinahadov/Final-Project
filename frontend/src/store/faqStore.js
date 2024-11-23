import { toast } from "react-toastify";
import { create } from "zustand";

const useFaqStore = create((set) => ({
  faqs: [],
  faq: null,
  loading: false,
  error: null,

  // Fetch all FAQs
  fetchFaqs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/faq");
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      set({ faqs: data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Fetch a single FAQ by ID
  fetchSingleFaq: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:6262/api/faq/${id}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      set({ faq: data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Add a new FAQ
  addFaq: async (faqData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://localhost:6262/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      set((state) => ({ faqs: [...state.faqs, data], loading: false }));
      toast.success("FAQ added successfully!");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error("Failed to add FAQ.");
    }
  },

  // Edit an existing FAQ
  editFaq: async (id, faqData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:6262/api/faq/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      set((state) => ({
        faqs: state.faqs.map((faq) => (faq._id === id ? data : faq)),
        loading: false,
      }));
      toast.success("FAQ edited successfully!");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error("Failed to edit FAQ.");
    }
  },

  // Delete an FAQ
  deleteFaq: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`http://localhost:6262/api/faq/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      set((state) => ({
        faqs: state.faqs.filter((faq) => faq._id !== id),
        loading: false,
      }));
      toast.success("FAQ deleted successfully!");
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error("Failed to delete FAQ.");
    }
  },
}));

export default useFaqStore;
