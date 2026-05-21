"use client";
import { useMemo, useState } from "react";
import { useDebounce } from "./config";
import { useRouter } from "next/navigation";

export function SearchPage({setShow, data}:{setShow:(val:boolean)=>void; data: any[]}) {
    const [Query,setQuery]=useState("");
    const router=useRouter();
   const debouncedValue=useDebounce(Query,500);
   const filteredRooms= useMemo(()=>{
     return data.filter((room)=>room.name.toLowerCase().includes(debouncedValue.toLowerCase()));
   },[debouncedValue])

    return(
        <div className="absolute min-h-screen w-full z-50 top-0 left-0 right-0  bg-black/50 flex justify-center items-center">
          <div className="w-full max-w-5xl mx-auto bg-linear-to-r from-[#202831]/60 via-[#25140d]/60 to-[#3a8abe]/60 backdrop-blur-md  border border-white/20  shadow-lg  rounded-xl p-4 pt-5">
            <div className="w-full">
                <div className="flex items-center mb-5 gap-2">
                    <input onChange={(e)=>setQuery(e.target.value)} className="w-full bg-gray-300 outline-none p-2 rounded-2xl focus:ring-4 focus:ring-[#ac3f10]" type="text"  placeholder="Search Your Rooms..."/>
                    <button className="font-medium bg-red-500 py-2 px-4 rounded-xl text-white cursor-pointer hover:bg-red-800 " onClick={()=>setShow(false)}>Close</button>
                </div>

                <div className="w-full max-h-96 overflow-y-auto">
                    {filteredRooms.length>0 ? (
                        filteredRooms.map((room:any,idx:number)=>(
                            <div onClick={()=>router.push(`canvas/${idx}`)} key={idx} className="w-full bg-gray-200 rounded-md p-3 mb-3 cursor-pointer hover:bg-gray-300">
                                <h1 className={`text-lg font-bold`}>{room.name}</h1>
                                <p className="text-sm text-gray-500">{room.Desc}</p>    
                            </div>
                        ))
                    ) : (
                        <div className="w-full h-20 flex items-center justify-center text-gray-300 text-xl">
                            No rooms found
                            </div>
                    )}
                    </div>
            </div>
          </div>
        </div>
    )
}