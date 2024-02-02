import { Kafka, Producer } from "kafkajs";
import path from "path";
import fs from "fs";
export const kafka = new Kafka({
  clientId: "my-app",
  brokers: [""],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    mechanism: "plain",
    username: "avnadmin",
    password: "",
  },
});

let producer: null | Producer;

export const getProducer = async () => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect();
  }
  return producer;
};

export const produceMessage = async (topic: string, message: string) => {
  const producer = await getProducer();
  await producer.send({
    topic,
    messages: [{ key: `message- ${Date.now()}`, value: message }],
  });
  return true;
};
