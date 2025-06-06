import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Add custom id property
    } & DefaultSession['user']; // Preserve default properties (name, email, image)
  }
}