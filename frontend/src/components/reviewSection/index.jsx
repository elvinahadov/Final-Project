import React, { useEffect, useState } from "react";
import useReviewStore from "../../store/reviewStore";
import useAuthStore from "../../store/authStore";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

const ReviewSection = ({ productId }) => {
  const {
    reviews,
    loading,
    fetchReviews,
    addReview,
    editReview,
    deleteReview,
  } = useReviewStore();
  const { user, isLogin, fetchUserById } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewedUsers, setReviewedUsers] = useState({});

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId, fetchReviews]);

  useEffect(() => {
    const fetchReviewedUsers = async () => {
      const users = {};
      
      for (const review of reviews) {
        if (review.userId && !users[review.userId._id]) {
          try {
            const userData = await fetchUserById(review.userId._id);
            if (userData) {
              users[review.userId._id] = userData;
            }
          } catch (err) {
            console.error("Can't get user data:", err);
          }
        }
      }
      setReviewedUsers(users);
    };

    if (reviews.length > 0) {
      fetchReviewedUsers();
    }
  }, [reviews, fetchUserById]);

  const handleAddReview = async () => {
    console.log("Adding review with rating:", rating, "and comment:", comment);
    if (!rating || !comment) {
      toast.error("Please provide both a rating and a comment.");
      return;
    }

    if (!isLogin) {
      toast.error("You need to be logged in to submit a review.");
      return;
    }

    setIsReviewing(true);

    try {
      await addReview(productId, user._id, rating, comment);
      setRating(0);
      setComment("");
      fetchReviews(productId);
    } catch (err) {
      console.error("Error adding review:", err);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleEditReview = async () => {
    console.log("Editing review with rating:", rating, "and comment:", comment); // Yorum düzenleniyor mu?
    if (!rating || !comment) {
      toast.error("Please provide both a rating and a comment.");
      return;
    }

    if (!isLogin) {
      toast.error("You need to be logged in to submit a review.");
      return;
    }

    setIsReviewing(true);

    try {
      await editReview(productId, editingReview._id, rating, comment, user._id);
      setEditingReview(null);
      setRating(0);
      setComment("");
      fetchReviews(productId);
    } catch (err) {
      console.error("Error editing review:", err);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    console.log("Deleting review with ID:", reviewId); // Yorum siliniyor mu?
    if (!isLogin) {
      toast.error("You need to be logged in to delete a review.");
      return;
    }

    try {
      await deleteReview(productId, reviewId, user._id);
      fetchReviews(productId);
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`inline-block ${
            i <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="review-section max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Customer Reviews
      </h2>

      <div className="review-form bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Add Your Review
        </h3>
        {isLogin ? (
          <>
            <div className="flex gap-2 mb-4">
              <label className="text-gray-600">Rating:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <div
                    key={r}
                    className={`inline-block cursor-pointer ${
                      r <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() => setRating(r)}
                  >
                    <FaStar />
                  </div>
                ))}
              </div>
            </div>
            <textarea
              className="border p-2 w-full mt-2 text-black rounded-md"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={editingReview ? handleEditReview : handleAddReview}
              disabled={isReviewing || !rating || !comment}
              className="mt-4 bg-black text-white px-6 py-2 rounded-lg disabled:opacity-60"
            >
              {isReviewing
                ? "Submitting..."
                : editingReview
                ? "Update Review"
                : "Submit Review"}
            </button>
          </>
        ) : (
          <p className="text-gray-500">Please log in to add a review.</p>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : (
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="text-gray-500">
              No reviews yet. Be the first to write one!
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="review mb-6 p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {review.userId && reviewedUsers[review.userId._id] && (
                    <img
                      src={
                        reviewedUsers[review.userId._id]?.profilePic
                          ?.secure_url || ""
                      }
                      alt={reviewedUsers[review.userId._id]?.name || "User"}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {reviewedUsers[review.userId._id]?.name} ~{reviewedUsers[review.userId._id]?.surname}
                    </p>
                    <p className="text-sm text-gray-500">
                      Rating: {renderStars(review.rating)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
                {review.userId?._id === user?._id && (
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => {
                        setEditingReview(review);
                        setRating(review.rating);
                        setComment(review.comment);
                      }}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
