import 'dotenv/config';
import { PrismaClient } from '@/lib/generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';

const connectionString = `${process.env.DATABASE_URL}`

import { withAccelerate } from "@prisma/extension-accelerate"
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
const adapter = new PrismaNeon({ connectionString })
export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter }).$extends(withAccelerate())
 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// export const prisma = new PrismaClient()