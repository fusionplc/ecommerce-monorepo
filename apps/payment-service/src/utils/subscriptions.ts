import { consumer } from "./kafka";
import { createPaystackProduct, deletePaystackProduct } from "./paystackProduct";

export const runKafkaSubscriptions = async () => {
  consumer.subscribe([
    {
      topicName: "product.created",
      topicHandler: async (message) => {
        const product = message.value;
        console.log("Received message: product.created", product);
        await createPaystackProduct(product);
      },
    },
    {
      topicName: "product.deleted",
      topicHandler: async (message) => {
        const productId = message.value;
        console.log("Received message: product.deleted", productId);
        await deletePaystackProduct(productId);
      },
    },
  ]);
};