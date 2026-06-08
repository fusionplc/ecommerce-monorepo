"use client";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ShippingFormInputs } from "@repo/types";
import useCartStore from "@/stores/cartStore";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!;

const PaystackPaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const { cart } = useCartStore();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
        {
          method: "POST",
          body: JSON.stringify({ cart }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const json = await response.json();
      if (json.authorization_url) {
        // ✅ Redirect to Paystack hosted payment page
        window.location.href = json.authorization_url;
      } else {
        setError("Failed to initialize payment. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">
        You will be redirected to Paystack to complete your payment securely.
      </p>
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-3 rounded-lg cursor-pointer font-medium disabled:opacity-50"
      >
        {loading ? "Initializing Payment..." : "Pay Now"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PaystackPaymentForm;
