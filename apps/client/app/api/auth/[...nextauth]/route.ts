import NextAuth from "next-auth/next";
import { authOptions } from "./option";

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST }
