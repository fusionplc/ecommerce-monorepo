// import { Kafka } from "kafkajs";

// export const createKafkaClient = (service: string) => {
//   return new Kafka({
//     clientId: service,
//     brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
//   });
// };


import { Kafka, logLevel } from "kafkajs";

export const createKafkaClient = (service: string) => {
  const brokers = process.env.REDPANDA_BROKERS;
  const username = process.env.REDPANDA_USERNAME;
  const password = process.env.REDPANDA_PASSWORD;

  if (!brokers) throw new Error(`[${service}] REDPANDA_BROKERS env var is not set`);
  if (!username) throw new Error(`[${service}] REDPANDA_USERNAME env var is not set`);
  if (!password) throw new Error(`[${service}] REDPANDA_PASSWORD env var is not set`);

  return new Kafka({
    clientId: service,
    brokers: brokers.split(","), // supports multiple brokers if needed
    ssl: true,                   // Redpanda Cloud requires TLS
    sasl: {
      mechanism: "scram-sha-256",
      username,
      password,
    },
    logLevel: logLevel.ERROR,
  });
};