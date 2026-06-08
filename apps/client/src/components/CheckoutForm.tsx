// "use client";
// import { ShippingFormInputs } from "@repo/types";
// import { useState } from "react";
// import { usePaystackPayment } from "react-paystack";

// const CheckoutForm = ({
//   shippingForm,
//   email,
//   amount,
//   publicKey,
//   onSuccess,
//   onClose,
// }: {
//   shippingForm: ShippingFormInputs;
//   email: string;
//   amount: number;
//   publicKey: string;
//   onSuccess: (reference: string) => void;
//   onClose: () => void;
// }) => {
//   const config = {
//     reference: new Date().getTime().toString(),
//     email,
//     amount,
//     publicKey,
//     metadata: {
//       custom_fields: [
//         {
//           display_name: "Shipping Address",
//           variable_name: "shipping_address",
//           value: `${shippingForm.address}, ${shippingForm.city}`,
//         },
//       ],
//     },
//   };

//   const initializePayment = usePaystackPayment(config);

//   return (
//     <div className="flex flex-col gap-4">
//       <p className="text-sm text-gray-500">
//         You will be redirected to Paystack to complete your payment securely.
//       </p>
//       <button
//         onClick={() =>
//           // ✅ Call directly in onClick, no async wrapper
//           initializePayment({
//             onSuccess: (ref) => onSuccess(ref.reference),
//             onClose,
//           })
//         }
//         className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-3 rounded-lg cursor-pointer font-medium"
//       >
//         Pay Now
//       </button>
//     </div>
//   );
// };

// export default CheckoutForm;
