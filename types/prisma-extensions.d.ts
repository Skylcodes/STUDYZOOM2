/**
 * Type extensions for Prisma Client
 * This file extends the Prisma Client types to include our new models
 */

import { PrismaClient, Prisma } from '@prisma/client';

declare global {
  // Extend PrismaClient to include our new models
  namespace PrismaClient {
    interface ExtendedModels {
      contactImage: Prisma.ContactImageDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;
      studyMaterial: Prisma.StudyMaterialDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;
    }
  }
}

// Extend the PrismaClient type to include our custom models
declare module '@prisma/client' {
  interface PrismaClient extends PrismaClient.ExtendedModels {}
}
