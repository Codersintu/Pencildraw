"use client"
import { Pencil } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar(){
    const { data: session } = useSession();
    console.log("session:",session);
    return(
        <div className="w-full fixed right-0 left-0 z-50 top-3 ">
            <div className="w-full max-w-6xl mx-auto px-5 py-4 rounded-full bg-linear-to-r from-[#465362] via-[#62240C] to-[#526881]">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Pencil className="w-10 h-10 text-[#c5b1a9]"/>
                    <h1 className="text-3xl text-[#c5b1a9] font-bold">PencilDraw</h1>
                </div>
                <div className="flex items-center gap-10">
                    <a href="#home" className="text-gray-400 hover:text-gray-200 transition-colors">Home</a>
                    <a href="#feature" className="text-gray-400 hover:text-gray-200 transition-colors">Feature</a>
                    <a href="#about" className="text-gray-400 hover:text-gray-200 transition-colors">About</a>
                </div>

                {session && (
                    <button onClick={()=>signOut()} className="bg-[#c5b1a9] text-[#465362] cursor-pointer hover:bg-[#62240C] hover:text-white transition-colors py-2 px-4 rounded-full">
                        Log out
                    </button>
                )}
             </div>
            </div>
        </div>
    )
}