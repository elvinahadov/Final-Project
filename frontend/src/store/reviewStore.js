import { create } from "zustand";
import { toast } from "react-toastify";

const useReviewStore = create((set, get) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviews: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:6262/api/reviews/${productId}`
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to fetch reviews");

      set({ reviews: data.reviews });
    } catch (error) {
      set({ error: error.message });
      toast.error("Could not retrieve reviews.");
    } finally {
      set({ loading: false });
    }
  },

  // Add a new review
  addReview: async (productId, userId, rating, comment) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:6262/api/reviews/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, rating, comment }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to add review");

      set((state) => ({
        reviews: [...state.reviews, data.reviews[data.reviews.length - 1]],
      }));

      toast.success("Review added successfully!");
    } catch (error) {
      set({ error: error.message });
      toast.error(error.message || "Could not add review.");
    } finally {
      set({ loading: false });
    }
  },

  // Reset reviews state
  resetReviews: () => set({ reviews: [], error: null, loading: false }),

  // Edit review
  editReview: async (productId, reviewId, rating, comment, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:6262/api/reviews/${productId}/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment, userId }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to edit review");

      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === reviewId ? { ...review, rating, comment } : review
        ),
      }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Delete review
  deleteReview: async (productId, reviewId, userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:6262/api/reviews/${productId}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // Sending userId in the body
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to delete review");

      set((state) => ({
        reviews: state.reviews.filter((review) => review._id !== reviewId),
      }));

      toast.success("Review deleted successfully!");
    } catch (error) {
      set({ error: error.message });
      toast.error(error.message || "Could not delete review.");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useReviewStore;
