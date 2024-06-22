import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient({
    errorFormat: "pretty",
    log: ["query", "info", "warn"],
});


export default prisma;