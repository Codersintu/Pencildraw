"use client";


import CreateRoomPage from "@/component/CreateRoomPage";
import { SessionProvider } from "next-auth/react";

export default function Page() {
 
  return (
    <SessionProvider>
     <div className="">
     <CreateRoomPage />
     </div>
    </SessionProvider>
  );
}