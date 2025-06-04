import { PrismaClient } from "@prisma/client";

// Extends the global scope by declaring a variable prisma that can either be a PrismaClient instance or undefined.
// This allows to store the PrismaClient instance on the global object (globalThis) to reuse it.
declare global {
  var prisma: PrismaClient | undefined;
}

// Checks if globalThis.prisma already exists:
// if yes, it reuses the existing PrismaClient instance.
// If no, it creates a new PrismaClient instance.
// This ensures that only one instance of the Prisma client is created
const prismadb = globalThis.prisma || new PrismaClient();

// in dev mode, hot reloding would initiate a new instance of PrismaClient
// causing warnings and degredation of performance
// During hot reloads: The Node.js process isn’t fully restarted,
// so the global scope (i.e., globalThis) persists across module reloads.
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
