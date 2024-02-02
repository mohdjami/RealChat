import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    "query",
    //  "info", "warn"
  ],
  errorFormat: "pretty",
  // errorFormat: "minimal",
  // errorFormat: "colorless",
  // errorFormat: "colorful
});

export default prisma;
