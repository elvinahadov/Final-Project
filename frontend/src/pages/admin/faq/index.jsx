import React, { useState, useEffect } from "react";
import useFaqStore from "../../../store/faqStore";
import { Link } from "react-router-dom";

const Faq = () => {
  const { faqs, fetchFaqs, editFaq, deleteFaq, loading, error } = useFaqStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const openModal = (faq) => {
    setSelectedFaq(faq);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFaq(null);
    setShowModal(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const updatedFaq = {
      title: e.target.title.value,
      description: e.target.description.value,
    };

    await editFaq(selectedFaq._id, updatedFaq);
    closeModal();
  };

  const handleDelete = async (faqId) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      await deleteFaq(faqId);
    }
  };

  const toggleAccordion = (faqId) => {
    setActiveFaq(activeFaq === faqId ? null : faqId);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading FAQs...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="flex items-center justify-between px-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h1>
        <Link
          to="/admin/faq/add"
          className="text-white bg-black px-2 py-1 rounded-lg mb-8"
        >
          Add FAQ
        </Link>
      </div>
      <div className="max-w-4xl mx-auto">
        {faqs.map((faq) => (
          <div
            key={faq._id}
            className="border border-gray-300 rounded-lg mb-4 bg-white shadow-md"
          >
            <div
              className="flex justify-between items-center px-4 py-3 cursor-pointer"
              onClick={() => toggleAccordion(faq._id)}
            >
              <h2 className="text-lg font-semibold">{faq.title}</h2>
              <button
                className={`text-xl transform transition-transform ${
                  activeFaq === faq._id ? "rotate-180" : ""
                }`}
              >
                &#9660;
              </button>
            </div>
            {activeFaq === faq._id && (
              <div className="px-4 py-3">
                <p className="text-gray-600 mb-4">{faq.description}</p>
                <div className="flex space-x-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => openModal(faq)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDelete(faq._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedFaq && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold mb-4">Edit FAQ</h2>
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={selectedFaq.title}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={selectedFaq.description}
                  rows="4"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faq;