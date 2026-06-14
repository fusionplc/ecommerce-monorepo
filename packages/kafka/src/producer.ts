// import type { Kafka, Producer } from "kafkajs";
// import { Partitioners } from "kafkajs";

// export const createProducer = (kafka: Kafka) => {
//   const producer: Producer = kafka.producer({
//     createPartitioner: Partitioners.LegacyPartitioner,
//   });

//   const connect = async () => {
//     await producer.connect();
//   };
//   const send = async (topic: string, message: object) => {
//     await producer.send({
//       topic,
//       messages: [{ value: JSON.stringify(message) }],
//     });
//   };

//   const disconnect = async () => {
//     await producer.disconnect();
//   };

//   return { connect, send, disconnect };
// };

import type { Kafka, Producer } from "kafkajs";
import { Partitioners } from "kafkajs";

export const createProducer = (kafka: Kafka) => {
  const producer: Producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  let connected = false;

  const connect = async () => {
    if (connected) return;
    await producer.connect();
    connected = true;
    console.log("Kafka producer connected");
  };

  const send = async (topic: string, message: object) => {
    if (!connected) await connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  };

  const disconnect = async () => {
    if (!connected) return;
    await producer.disconnect();
    connected = false;
  };

  return { connect, send, disconnect };
};