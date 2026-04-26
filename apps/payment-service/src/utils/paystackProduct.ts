import { ProductEventType } from "@repo/types";

// Paystack has no product registry like Stripe.
// Products are managed in your own database.
// These functions are kept so Kafka subscriptions still work
// without breaking the rest of the app.

export const createPaystackProduct = async (item: ProductEventType ) => {
  try {
    // No Paystack API call needed - prices come directly
    // from your own DB at checkout time
    console.log("Product created, synced locally:", item.name);
    return item;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deletePaystackProduct = async (productId: number) => {
  try {
    // No Paystack API call needed
    console.log("Product deleted, removed locally:", productId);
    return { deleted: true, id: productId };
  } catch (error) {
    console.log(error);
    return error;
  }
};