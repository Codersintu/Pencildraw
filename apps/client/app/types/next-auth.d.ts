import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
    } & DefaultSession["user"];

    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    accessToken?: string;
  }
}