// @ts-ignore
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("Token", token);

  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/createRoom", "/canvas/:path*"],
};