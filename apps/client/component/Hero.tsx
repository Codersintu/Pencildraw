"use client"
import { ArrowRight } from "lucide-react";
import Animationbox from "./Animationbox";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Hero(){
  const { data: session } = useSession();
  const router = useRouter();
  console.log("session:",session);
    return(
      
        <div id="home" className="w-full min-h-screen bg-linear-to-r from-[#2D3844] via-[#62240C] to-[#62240C]">
            <div className="w-full inset-0 min-h-screen" style={{
             backgroundImage: `
             linear-gradient(rgba(0,255,255,0.08) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0,255,255,0.08) 1px, transparent 1px)
          `, backgroundSize: "60px 60px",
            }}>
            <div className="w-full max-w-7xl mx-auto  grid grid-cols-1 md:grid-cols-2 py-30 px-5">
            {/* left side */}
             <div className="space-y-10 flex flex-col justify-center items-center md:items-start">
                <div className="inline-block">
                    <span className="px-5 py-2 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">Free & Open Source</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight font-bold text-white">
                    sintu Freely,
                    <br />
                    <span className="text-blue-600 relative">
                        collaborate
                 <svg
                  className="absolute -bottom-2 left-0 w-full animate-draw-line"
                  viewBox="0 0 400 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10C50 5 150 2 200 8C250 14 350 18 398 12"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                 </svg>
                    </span>
                    <br />
                    seamlessly
                </h1>

            <p className="text-xl text-center md:text-start text-gray-300 leading-relaxed font-semibold max-w-xl">
              A virtual whiteboard for sketching hand-drawn like diagrams.
              Collaborative and end-to-end encrypted.
            </p>

            <div className="flex flex-wrap gap-5 justify-center md:justify-start">
              {!session && (
                <button onClick={()=>signIn()} className="bg-blue-600 cursor-pointer text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-2 group">
                  Sign Up
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
                {session && (
                <button onClick={() => router.push("/createRoom")}  className="bg-blue-600 cursor-pointer text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-2 group">
                  Start Drawing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <button className="border-2 cursor-pointer border-gray-300 text-gray-200 px-8 py-4 rounded-xl font-medium hover:border-gray-900  transition-all transform hover:scale-105">
                Drawing Demo
              </button>
            </div>
             </div>

             {/* right side */}
             <div className="py-10 md:py-0">
              <Animationbox/>
             </div>
            </div>
            </div>
        </div>
    )
  
}