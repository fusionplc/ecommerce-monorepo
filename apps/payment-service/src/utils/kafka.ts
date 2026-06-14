import { createConsumer, createKafkaClient, createProducer, createAdmin } from "@repo/kafka";

const kafkaClient = createKafkaClient("payment-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "payment-group");

export const createTopics = async (retries = 10, delay = 3000) => {
  const admin = createAdmin(kafkaClient);

  for (let i = 0; i < retries; i++) {
    try {
      await admin.connect();

      const existing = await admin.listTopics();
      const toCreate = ["payment.completed", "payment.failed"].filter(
        (t) => !existing.includes(t)
      );

      if (toCreate.length === 0) {
        console.log("✓ Payment Kafka topics already exist, continuing...");
        await admin.disconnect();
        return;
      }

      await admin.createTopics({
        waitForLeaders: true,
        validateOnly: false,
        topics: toCreate.map((topic) => ({
          topic,
          numPartitions: 3,
          replicationFactor: 1,
        })),
      });

      await admin.disconnect();
      console.log("✓ Payment Kafka topics ready");
      return;
    } catch (err: any) {
      console.log(`Kafka not ready, retrying... (${i + 1}/${retries})`);
      await admin.disconnect().catch(() => {});
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error("✗ Payment service could not connect to Kafka after maximum retries");
};