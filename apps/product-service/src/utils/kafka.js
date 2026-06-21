import { createConsumer, createKafkaClient, createProducer, createAdmin } from "@repo/kafka";
const kafkaClient = createKafkaClient("product-service");
export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "product-group");
export const createTopics = async (retries = 10, delay = 3000) => {
    const admin = createAdmin(kafkaClient);
    for (let i = 0; i < retries; i++) {
        try {
            await admin.connect();
            const existing = await admin.listTopics();
            const toCreate = ["product.created", "product.deleted"].filter((t) => !existing.includes(t));
            if (toCreate.length === 0) {
                console.log("✓ Kafka topics already exist, continuing...");
                await admin.disconnect();
                return;
            }
            await admin.createTopics({
                waitForLeaders: true,
                validateOnly: false,
                topics: toCreate.map((topic) => ({
                    topic,
                    numPartitions: 3,
                    replicationFactor: 1, // ← 1 for Serverless, 3 for Dedicated
                })),
            });
            await admin.disconnect();
            console.log("✓ Kafka topics ready");
            return;
        }
        catch (err) {
            console.log(`Kafka not ready, retrying... (${i + 1}/${retries})`);
            await admin.disconnect().catch(() => { });
            await new Promise((res) => setTimeout(res, delay));
        }
    }
    throw new Error("✗ Could not connect to Kafka after maximum retries");
};
