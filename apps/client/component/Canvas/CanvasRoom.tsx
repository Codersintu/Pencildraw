"use client";
import { useState } from "react";
import {  useWebSocketConnect } from "../config";
import { CanvasBoard } from "./CanvasBoard";

// CanvasRoom component to connect to websocket and render canvas
export default function CanvasRoom({roomId}:{roomId:number}) {
    const {socket,status}=useWebSocketConnect(roomId);

    if(!socket.current) return <div className="w-full min-h-screen flex justify-center items-center">{status}</div>;

    
    return (
        <CanvasBoard socket={socket.current} roomId={roomId} />
    );
}