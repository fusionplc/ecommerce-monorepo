import { Kafka } from "kafkajs";

export const createAdmin = (kafka: Kafka) => kafka.admin();


