import { CanvasEngine } from "@/Draw/CanvasEngine";
import { ArrowRight, Circle, Dot, Ellipsis, Eraser, Hand, Minus, MinusIcon, Pencil, Pentagon, Square, Text, Triangle, Type, UserPlus } from "lucide-react"
import { useEffect, useRef, useState } from "react";
import { useBackendToken } from "../config";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export type ToolType = "rect" | "circle" | "line" | "arrow" | "triangle" | "pentagon" | "pencil" | "eraser" | "zoom" | "text";
export type strokeColorType="red" | "black" | "green" | "yellow" | "blue" | "cyan";
export type strokeBackgroundColorType="red" | "black" | "green" | "yellow" | "blue" | "cyan" | "pink" | "white";

export function CanvasBoard({socket,roomId}:{socket:WebSocket,roomId:number}) {
        const {data:token}=useBackendToken();
        const [selectedTool,setSelectedTool]=useState<ToolType>("rect");
        const [stroke,setStroke]=useState<strokeColorType>("black");
        const [strokeBackground,setstrokeBackground]=useState<strokeBackgroundColorType | "">("white")
        const [strokeWidth,setStrokeWidth]=useState<number>(2)
        const [strokeStyle,setStrokeStyle]=useState<number[]>([]);
        const [UserMode,setUserMode]=useState<string | null>(null);

        const canvasRef=useRef<HTMLCanvasElement>(null);
        const toolsRef=useRef<ToolType>(selectedTool);
        const strokeRef=useRef<string>(stroke);
        const strokeBackgroundRef=useRef<string>(strokeBackground)
        const strokeWidthRef=useRef<number>(strokeWidth)
        const strokeStyleRef=useRef<number[]>(strokeStyle)
        const ModeRef=useRef<string | null>(UserMode)
       

        useEffect(()=>{
            toolsRef.current=selectedTool;
            strokeRef.current=stroke;
            strokeBackgroundRef.current=strokeBackground;
            strokeWidthRef.current=strokeWidth;
            strokeStyleRef.current=strokeStyle;
            ModeRef.current=UserMode;
            console.log("current tool",toolsRef.current,strokeRef.current)
        },[selectedTool,stroke,strokeBackground,strokeWidth,strokeStyle,UserMode]) 

        useEffect(()=>{
           if(!socket || !canvasRef.current || !token) return;
           const draw=new CanvasEngine(
            canvasRef.current,
            socket,
            roomId,
            toolsRef,
            token,
            strokeRef,
            strokeBackgroundRef,
            strokeWidthRef,
            strokeStyleRef,
            ModeRef
            
           )
           console.log("CanvasEngine class initialized",draw);

           return ()=>{
            (draw as any).destroy?.()
           }

        },[canvasRef,roomId,socket])


        const InvitePeople=()=>{
            const inviteLink =`${window.location.origin}/canvas/${roomId}?mode=view`;
            navigator.clipboard.writeText(inviteLink).then(()=>{
                toast.success("Invite link copied to clipboard!");
            }).catch((err)=>{
                toast.error("Failed to copy invite link: ");
            }
            )
        }

      
        useEffect(()=>{
              const searchParams=new URLSearchParams(window.location.search);
              setUserMode(searchParams.get("mode"));
            if(searchParams.get("mode")==="view"){
                toast.message("You are in view only mode, you can't draw here",{
                    icon:"👀"
                })
            }
        },[])



    return (
    <div className="relative w-full h-full">
        {/* canvas */}
            <canvas  width={window.innerWidth} height={window.innerHeight} ref={canvasRef} style={{backgroundColor:"white"}}></canvas>

            {UserMode !== "view" && (
            <>
            <div onClick={()=> InvitePeople()} className="absolute top-4 right-4 cursor-pointer hover:bg-gray-200 rounded-full p-2 ">
                <UserPlus />
            </div>

            {/* stroke */}
             <div className="absolute left-5 top-20  flex justify-start">
                <div className="w-full max-w-2xl rounded-2xl p-5 shadow-2xl bg-white">
                  <div className="flex flex-col gap-4">
                    {/* for stroke color */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-sm text-gray-500">Stroke</h1>
                        <div className="grid grid-cols-5 gap-2 cursor-pointer">
                            <div onClick={()=>setStroke("black")} className={`w-8 h-8 rounded-xl bg-black hover:scale-105 ${stroke==='black'?'border-3 p-2 border-gray-500':""}`}></div>
                            <div onClick={()=>setStroke("red")} className={`w-8 h-8 rounded-xl bg-red-600 hover:scale-105 ${stroke==='red'?'border-3 p-2 border-gray-500':""}`}></div>
                            <div onClick={()=>setStroke("green")} className={`w-8 h-8 rounded-xl bg-green-600 hover:scale-105 ${stroke==='green'?'border-3 p-2 border-gray-500':""}`}></div>
                            <div onClick={()=>setStroke("blue")} className={`w-8 h-8 rounded-xl bg-blue-600 hover:scale-105 ${stroke==='blue'?'border-3 p-2 border-gray-500':""}`}></div>
                             <div onClick={()=>setStroke("cyan")} className={`w-8 h-8 rounded-xl bg-cyan-600 hover:scale-105 ${stroke==='cyan'?'border-3 p-2 border-gray-500':""}`}></div>
                             <div onClick={()=>setStroke("yellow")} className={`w-8 h-8 rounded-xl bg-yellow-600 hover:scale-105 ${stroke==='yellow'?'border-3 p-2 border-gray-500':""}`}></div>
                        </div>
                    </div>
                    {/* for background */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-sm">Background</h1>
                        <div className="grid grid-cols-5 gap-2 cursor-pointer">
                            <div onClick={()=>setstrokeBackground("white")} className={`w-8 h-8 rounded-xl bg-[#eeeed2] hover:scale-105 ${strokeBackground==='white'?'border-3 p-2 border-gray-400':""}`}></div>
                            <div onClick={()=>setstrokeBackground("pink")} className={`w-8 h-8 rounded-xl bg-[#ffc9c9] hover:scale-105 ${strokeBackground==='pink'?'border-3 p-2 border-gray-400':""}`}></div>
                            <div onClick={()=>setstrokeBackground("green")} className={`w-8 h-8 rounded-xl bg-[#b2f2bb] hover:scale-105 ${strokeBackground==='green'?'border-3 p-2 border-gray-400':""}`}></div>
                            <div onClick={()=>setstrokeBackground("cyan")} className={`w-8 h-8 rounded-xl bg-[#a5d8ff] hover:scale-105 ${strokeBackground==='cyan'?'border-3 p-2 border-gray-400':""}`}></div>
                             <div onClick={()=>setstrokeBackground("yellow")} className={`w-8 h-8 rounded-xl bg-[#ffec99] hover:scale-105 ${strokeBackground==='yellow'?'border-3 p-2 border-gray-400':""}`}></div>       
                        </div>
                    </div>
                    {/* stroke width */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-sm">Stroke width</h1>
                        <div className="flex gap-3 cursor-pointer">
                           <div onClick={()=>setStrokeWidth(2)} className={`w-8 h-8 rounded-xl bg-[#eeeed2] hover:scale-105 flex items-center justify-center ${strokeWidth===2?'border-3 border-gray-400':""}`}><MinusIcon strokeWidth={1}/></div>
                           <div onClick={()=>setStrokeWidth(3)} className={`w-8 h-8 rounded-xl bg-[#eeeed2] hover:scale-105 flex items-center justify-center ${strokeWidth===3?'border-3  border-gray-400':""}`}><MinusIcon strokeWidth={3}/></div>
                             <div onClick={()=>setStrokeWidth(5)} className={`w-8 h-8 rounded-xl bg-[#eeeed2] hover:scale-105 flex items-center justify-center ${strokeWidth===5?'border-3 border-gray-400':""}`}><MinusIcon strokeWidth={5}/></div>
                        </div>
                    </div>

                    {/* strokestyle */}
                    <div className="flex flex-col gap-2">
                       <h1 className="text-sm">Stroke Style</h1>
                        <div className="flex gap-3 cursor-pointer">
                           <div onClick={()=>setStrokeStyle([])} className={`w-8 h-8 rounded-xl bg-[#eeeed2] hover:scale-105 flex items-center justify-center ${strokeStyle.length===0?'border-3  border-gray-400':""}`}><MinusIcon strokeWidth={1}/></div>
                           <div onClick={()=>setStrokeStyle([10,5])} className={`w-8 h-8 rounded-xl bg-[#eeeed2] hover:scale-105 flex items-center justify-center ${strokeStyle[0]===10?'border-3 border-gray-400':""}`}><Ellipsis strokeWidth={2}/></div>
                            <div onClick={()=>setStrokeStyle([2,5])} className={`w-8 h-8 rounded-xl bg-[#eeeed2] hover:scale-105 flex items-center justify-center ${strokeStyle[0]===2?'border-3 border-gray-400':""}`}><Dot strokeWidth={3}/><Dot strokeWidth={3}/><Dot strokeWidth={3}/></div>
                        </div>
                    </div>

                  </div>
                </div>
             </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center ">
                <div className="gap-6 p-2 rounded-full shadow-lg cursor-pointer bg-gray-200 flex">
                <Square onClick={() => setSelectedTool("rect")} className={`w-8 h-8 hover:bg-gray-300 rounded-md p-1 ${selectedTool === "rect" ? "bg-gray-500" : ""}`} />
                <Circle onClick={() => setSelectedTool("circle")} className={`w-8 h-8  hover:bg-gray-300 rounded-md p-1 ${selectedTool === "circle" ? "bg-gray-500" : ""}`} />
                <Minus onClick={() => setSelectedTool("line")} className={`w-8 h-8  hover:bg-gray-300 rounded-md p-1 ${selectedTool === "line" ? "bg-gray-500" : ""}`} />
                <ArrowRight onClick={() => setSelectedTool("arrow")} className={`w-8 h-8 hover:bg-gray-300 rounded-md p-1 ${selectedTool === "arrow" ? "bg-gray-500" : ""}`} />
                <Triangle onClick={() => setSelectedTool("triangle")} className={`w-8 h-8 hover:bg-gray-300 rounded-md p-1 ${selectedTool === "triangle" ? "bg-gray-500" : ""}`} />
                <Pentagon onClick={() => setSelectedTool("pentagon")} className={`w-8 h-8 font-semibold hover:bg-gray-300 rounded-md p-1 ${selectedTool === "pentagon" ? "bg-gray-500" : ""}`} />
                <Type onClick={() => setSelectedTool("text")} className={`w-8 h-8 font-semibold hover:bg-gray-300 rounded-md p-1 ${selectedTool === "text" ? "bg-gray-500" : ""}`}/>
                <Pencil onClick={() => setSelectedTool("pencil")} className={`w-8 h-8 hover:bg-gray-300 rounded-md p-1 ${selectedTool === "pencil" ? "bg-gray-500" : ""}`} />
                <Eraser onClick={() => setSelectedTool("eraser")} className={`w-8 h-8 hover:bg-gray-300 rounded-md p-1 ${selectedTool === "eraser" ? "bg-gray-500" : ""}`} />
                <Hand onClick={() => setSelectedTool("zoom")} className={`w-8 h-8 hover:bg-gray-300 rounded-md p-1 ${selectedTool === "zoom" ? "bg-gray-500" : ""}`} />
            </div>
            </div>
            </>
            )}
        </div>
    );
}