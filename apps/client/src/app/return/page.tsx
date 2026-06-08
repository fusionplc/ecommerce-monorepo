"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const ReturnPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found.");
      return;
    }

    // ✅ Verify payment with your backend
    fetch(
      `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${reference}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setStatus("success");
          setMessage("Payment successful! Your order has been placed.");
        } else {
          setStatus("failed");
          setMessage(`Payment failed: ${data.paymentStatus}`);
        }
      })
      .catch(() => {
        setStatus("failed");
        setMessage("Could not verify payment. Please contact support.");
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Verifying your payment...</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Payment Successful!
          </h1>
          <p className="text-gray-500 text-sm">{message}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      )}

      {status === "failed" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Payment Failed
          </h1>
          <p className="text-gray-500 text-sm">{message}</p>
          <button
            onClick={() => router.push("/cart")}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ReturnPage;
