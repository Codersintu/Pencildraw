"use client";
import { existingCanvasShape } from "@/Draw/http";
import { BACKEND_URL, WS_URL } from "@repo/common-data/index";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import {   useEffect, useRef, useState } from "react";



export function useBackendToken() {
  const {data:session,status}= useSession(); 

  return useQuery({
    queryKey: ["backendToken", session?.user.id],
    queryFn: async () => {
      if(status === "loading") return null;
      if(!session?.user.id) return null;
      try {
        const response = await axios.post(`${BACKEND_URL}/api/room/token`, {
          userId: session?.user?.id,
        });
        return response.data.token;
      } catch (error) {
        return null;
      }
    },
    enabled:!! session?.user.id ,
    staleTime: 1000 * 60 * 60 * 24 * 6, // 6 days
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  })
}

// export function useCanvasShape(roomId: string) {
//   const { data: token } = useBackendToken();

//   return useQuery({
//     queryKey: ["canvasShapes", roomId],
//     queryFn: async()=>{
//       if(!token) return [];
//       return existingCanvasShape(roomId,token);
//     }
// })
// } 

// debaounce function
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return ()=> clearTimeout(handler);
  },[value,delay]);

  return debouncedValue;
}


// custom hook to connect to websocket and handle messages
type Status = "connecting to server..." | "open" | "closed" | "error";

export const useWebSocketConnect=(roomId:number)=>{
  const socketRef=useRef<WebSocket|null>(null);
  const [status,setStatus]=useState<Status>("connecting to server...");
  const {data:token}=useBackendToken();
  useEffect(()=>{
       

        if( !token) return ;
        const ws=new WebSocket(`${WS_URL}?token=${token}&roomId=${roomId}`);
        socketRef.current = ws;
      
        ws.onopen=()=>{
          
          setStatus("open");
            ws.send(JSON.stringify({type:"join_room",roomId:roomId}));
        }
        
        ws.onclose=()=>{
          
          setStatus("closed");
        }

        ws.onerror=()=>{
          
          setStatus("error");
        }
    
    return ()=>{
      if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    }
   
  },[roomId,token])

  return {
    socket:socketRef,
    status
  };
}


