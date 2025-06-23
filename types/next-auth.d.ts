// Type definitions for next-auth
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      organizationId: string; // Legacy field
      studyGroupId: string; // New field that maps to organizationId
    };
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    organizationId: string; // Legacy field
    studyGroupId: string; // New field that maps to organizationId
  }
}
