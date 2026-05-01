import { createConsumer, createKafkaClient, createProducer, createAdmin } from "@repo/kafka";

const kafkaClient = createKafkaClient("payment-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "payment-group");


export const createTopics = async (retries = 10, delay = 3000) => {
  const admin = createAdmin(kafkaClient);

  for (let i = 0; i < retries; i++) {
    try {
      await admin.connect();
      await admin.createTopics({
        waitForLeaders: true,
        validateOnly: false,
        topics: [
          { topic: "product.created", numPartitions: 3, replicationFactor: 3 },
          { topic: "product.deleted", numPartitions: 3, replicationFactor: 3 },
        ],
      });
      await admin.disconnect();
      console.log("✓ Kafka topics ready");
      return;
    } catch (err: any) {
      // Topics already exist — that's fine
      if (err?.message?.includes("Topic creation errors")) {
        console.log("✓ Kafka topics already exist, continuing...");
        await admin.disconnect().catch(() => {});
        return;
      }
      console.log(`Kafka not ready, retrying... (${i + 1}/${retries})`);
      await admin.disconnect().catch(() => {});
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error("✗ Could not connect to Kafka after maximum retries");
};
