import { create } from "zustand";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QO2A9LLRJ67uglnwYJlDnYo53HbwLjznTU43QZnzMZAumm1cmbtDOOMPOjgsuDQC4Q8nRKgZXnqDztQutn2H8RN008P3Mn4jc"
);

const usePaymentStore = create((set, get) => ({
  paymentIntent: null,
  loading: false,
  error: null,

  createPaymentIntent: async (userId, products, shippingAddress) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(
        "http://localhost:6262/api/payment/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, products, shippingAddress }),
        }
      );

      if (!response.ok) throw new Error("Failed to create payment intent");

      const { clientSecret, paymentIntentId } = await response.json();
      set({ paymentIntent: { clientSecret, paymentIntentId } });

      return { clientSecret, paymentIntentId };
    } catch (error) {
      set({ error: error.message });
      toast.error("Payment could not be initiated.");
    } finally {
      set({ loading: false });
    }
  },
  confirmPayment: async (paymentIntentId, orderId, clientSecret) => {
    set({ loading: true, error: null });

    try {
      const stripe = await stripePromise;

      // Ensure you're passing the actual element (not a string)
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(PaymentElement),
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
      set({ error: error.message });
      toast.error("Payment confirmation failed.");
      throw error; // Rethrow for handling in UI
    } finally {
      set({ loading: false });
    }
  },

  resetPayment: () => set({ paymentIntent: null, error: null, loading: false }),
}));

export default usePaymentStore;
