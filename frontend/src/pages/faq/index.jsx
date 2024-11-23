import React, { useState, useEffect } from "react";
import useFaqStore from "../../store/faqStore";


const Faqs = () => {
  const { faqs, fetchFaqs, loading, error } = useFaqStore();
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

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
    <div className="min-h-screen p-4 bg-gray-100 my-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h1>

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
                <p className="text-gray-600">{faq.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;