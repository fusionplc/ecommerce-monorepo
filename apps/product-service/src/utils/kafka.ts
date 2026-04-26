import { createConsumer, createKafkaClient, createProducer, createAdmin } from "@repo/kafka";

const kafkaClient = createKafkaClient("product-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "product-group");

export const createTopics = async () => {
  const admin = createAdmin(kafkaClient);
  await admin.connect();
  await admin.createTopics({
    waitForLeaders: true,
    topics: [
      { topic: "product.created", numPartitions: 3, replicationFactor: 3 },
      { topic: "product.deleted", numPartitions: 3, replicationFactor: 3 },
    ],
  });
  await admin.disconnect();
};
