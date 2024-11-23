import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import usePaymentStore from "../../store/paymentStore";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QO2A9LLRJ67uglnwYJlDnYo53HbwLjznTU43QZnzMZAumm1cmbtDOOMPOjgsuDQC4Q8nRKgZXnqDztQutn2H8RN008P3Mn4jc"
);

const PaymentPage = () => {
  const { orderId } = useParams();
  const { confirmPayment, loading: paymentLoading } = usePaymentStore();
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch(
          `http://localhost:6262/api/payment/${orderId}/payment-intent`
        );
        const result = await response.json();
        if (response.ok) {
          setClientSecret(result.clientSecret); // Store clientSecret
          setPaymentIntentId(result.paymentIntentId); // Store paymentIntentId
        } else {
          toast.error("Error fetching payment details.");
        }
      } catch (error) {
        toast.error("Error fetching payment details.");
        console.error("Error fetching payment intent:", error);
      }
    };

    fetchPaymentIntent();
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentIntentId || !clientSecret || !orderId || !stripe || !elements) {
      toast.error("Required information is missing.");
      return;
    }

    try {
      // Access the PaymentElement using elements.getElement(PaymentElement)
      const paymentElement = elements.getElement(PaymentElement);

      if (!paymentElement) {
        toast.error("Payment method element not found.");
        return;
      }

      // Confirm the payment with the element reference
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: paymentElement, // Pass the element directly
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error.message);
        throw new Error(error.message || "Payment confirmation failed");
      }

      const response = await fetch(
        "http://localhost:6262/api/payment/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentIntentId, orderId }),
        }
      );

      if (!response.ok) throw new Error("Payment confirmation failed");

      const result = await response.json();

      if (result.success) {
        toast.success("Payment successfully confirmed!");
      } else {
        throw new Error(result.message || "Payment confirmation failed");
      }

      return result;
    } catch (error) {
      toast.error("Payment confirmation failed.");
      throw error;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Complete Payment</h1>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <form onSubmit={handleSubmit}>
            {/* Payment Element */}
            <div id="payment-element">
              <PaymentElement />
            </div>
            <button
              type="submit"
              disabled={paymentLoading}
              className={`mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg ${
                paymentLoading ? "cursor-not-allowed" : ""
              }`}
            >
              {paymentLoading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </Elements>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
  );
};

export default PaymentPage;
