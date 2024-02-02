import { Kafka, Producer } from "kafkajs";
import path from "path";
import fs from "fs";
import prisma from "./db";
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
export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: "test-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGE", fromBeginning: true });
  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ topic, partition, message, pause }) => {
      console.log(`New mwssage: ${message.value}`);
      if (!message.value) return;
      try {
        await prisma.message.create({
          data: {
            text: message.value.toString(),
          },
        });
      } catch (error) {
        console.log("Something is wrong");
        console.error(error);
        pause();
        setTimeout(() => {
          console.log("Resuming");
          consumer.resume([
            {
              topic: "MESSAGE",
            },
          ]);
        }, 60 * 1000);
      }
    },
  });
}
