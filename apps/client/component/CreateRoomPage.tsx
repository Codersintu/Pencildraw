"use client";
import { useBackendToken } from "@/component/config";
import RoomInput from "@/component/RoomInput";
import { getRooms } from "@/lib/lib";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Code, Edit, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { SearchPage } from "./SearchPage";
import axios from "axios";
import { BACKEND_URL } from "@repo/common-data/index";
import { toast } from "sonner";

export default function CreateRoomPage() {
  const [show,setShow]=useState(false);
  const [showInput,setShowInput]=useState(false);
  const [editingRoomId,setEditingRoomId] =useState<number | null>(null);
  const nameRef=useRef<HTMLInputElement | null>(null);
  const DescRef=useRef<HTMLInputElement | null>(null);
  const {data:token}=useBackendToken();
  const router=useRouter();
  const queryClient=useQueryClient();

  const {data,isLoading}=useQuery({
    queryKey:["userrooms"],
     queryFn:async()=>{
      if(!token) throw new Error("No token available");
      return getRooms({token});
    }, 
  })

  const DeleteRoom=async(roomId:any)=>{
    
   const toastId =
     toast.loading("Deleting room...");
    try {
      if(!roomId || !token) toast.error("roomId and token are missing!");
        
    const response=  await axios.delete(`${BACKEND_URL}/api/room/delete/${roomId}`,{
      headers:{
       Authorization:`Bearer ${token}`
      }
    });

     toast.success(
         response.data.message,
         { id: toastId }
      );


    queryClient.invalidateQueries({
       queryKey:["userrooms"]
    });

   
    } catch (error:any) {
     toast.error(
        error.response?.data?.message || "Something went wrong",
         { id: toastId }
      );
    }

  }


const handleNameUpdate = async(
   e: React.FormEvent,
   roomId:any
) => {

   e.preventDefault();
   console.log("roomid",roomId)

   const toastId =
      toast.loading("Updating room...");

   try {
    let name=nameRef.current?.value;
    let Desc=DescRef.current?.value;

    if(!name ){
       toast.error(
            "name is missing!"
         );

         return;
    }

      if(!roomId || !token){

         toast.error(
            "roomId and token are missing!"
         );

         return;
      }

      const response =
      await axios.put(

         `${BACKEND_URL}/api/room/update/${roomId}`,

         {
            name: name,
            Desc: Desc
         },

         {
            headers:{
               Authorization:`Bearer ${token}`
            }
         }
      );

      toast.success(
         response.data.message,
         { id: toastId }
      );

      queryClient.invalidateQueries({
         queryKey:["userrooms"]
      });

      setEditingRoomId(null);

   } catch (error:any) {

      toast.error(
         error.response?.data?.message ||
         "Something went wrong",

         { id: toastId }
      );
   }
}


if(isLoading){
    return (
      <div className="min-h-screen bg-linear-to-r from-[#2D3844] via-[#62240C] to-[#62240C] flex justify-center items-center">
        <div className="text-gray-300 text-xl">Loading your workspaces...</div>
      </div>
    );
  }
  return (
    <>
    {!data || data.length === 0 ? (

     <div className="min-h-screen w-full bg-linear-to-r from-[#2D3844] via-[#62240C] to-[#62240C] flex flex-col relative ">
        <div className="min-h-screen w-full max-w-7xl flex justify-center items-center z-0 mx-auto">
            <div className="flex flex-col justify-center items-center gap-10">
              <div className="flex flex-col justify-center items-center gap-7 ">
                <div className="flex flex-col justify-center items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-300 ">No workspace yet</h1>
                  <p className="text-xl text-gray-400 text-center">You haven't created any workspace yet. Let's change that!</p>
                </div>
                <div className="flex flex-col justify-center items-center text-center">
                  <p className="text-sm text-gray-500">Don't want to create a workspace just yet? You are welcome to use our free open source</p>
                  <p className="text-sm text-gray-500">editor over at Pencildraw.com in the meantime.</p>
                </div>

                <div onClick={()=>setShow(true)} className="flex justify-center items-center gap-3 bg-blue-700 px-20 py-3 rounded-xl text-white font-semibold cursor-pointer">
                  <Plus />
                  Create workspace
                </div>

              </div>

              <div className="text-xs text-gray-400 hidden md:flex">
                --------------------------------  Need help?  -------------------------------
              </div>
              <div className="">
                <div className="flex justify-center items-center gap-2 text-gray-500">
                  <Code className="w-4 h-4" />
                  <p className="text-xs text-white">Report issue on GitHub</p>
                </div>
              </div>
            </div>
         </div>
    </div>

        ) : (
            <div className="min-h-screen w-full bg-linear-to-r from-[#202831] via-[#25140d] to-[#3a8abe] pt-5 relative">
              {/* Navbar part */}
              <div className="w-full max-w-6xl mx-auto px-5 py-4 rounded-full bg-linear-to-r from-[#465362] via-[#62240C] to-[#526881] fixed top-5 left-0 right-0 z-50 ">
             <div className="flex items-center justify-between">
                <div onClick={()=>router.push("/")}  className="flex items-center gap-2 cursor-pointer">
                    <Pencil className="w-10 h-10 text-[#9895b4]"/>
                    <h1 className="text-3xl text-[#c5b1a9] font-bold">PencilDraw</h1>
                </div>

                    <button onClick={()=>setShow(true)} className="bg-[#19029f] text-[#f8f8f8] cursor-pointer hover:bg-[#62240C] hover:text-white transition-colors py-2 px-4 rounded-full">
                        Create new room
                    </button>
             </div>
               </div>
              {/* room part */}
              <div className="w-full max-w-6xl flex flex-col mx-auto mt-20">
                <div className="flex items-center justify-between">
                <div className="flex-1 flex flex-col">
                  <h1 className="text-3xl font-bold text-gray-300 col-span-full">Your Rooms</h1>
                  <p className="text-gray-400 mb-5">Click on a room to enter the canvas</p>
                </div>
                  <div className="flex-1 rounded-md ">
                    <input onFocus={()=>setShowInput(true)} className={`w-full bg-gray-200 text-black outline-none  p-2 rounded-md`} type="text" placeholder="Search room..."/>
                  </div>
                      {showInput && <SearchPage setShow={setShowInput} data={data} />}
                </div>
                <div className="relative w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mx-auto gap-5">
                  
                {data.map((room: any, idx: number) => (
                  
                 <div onClick={()=>router.push(`canvas/${room.id}`)} className="relative w-full max-w-xl rounded-2xl bg-linear-to-r from-[#2D3844] via-[#62240C] to-[#de5925] p-5 shadow-lg cursor-pointer hover:shadow-2xl hover:border-cyan-500 hover:border transition-shadow" key={room.id}>
                    <div className="flex flex-col justify-center items-center gap-3 text-gray-300">
                      {editingRoomId === room.id ?
                      
                        <form  onClick={(e)=>{ e.stopPropagation(); }}
                           onSubmit={(e)=>{
                              handleNameUpdate(e, room.id);
                           }}
                           className="flex gap-2 justify-center items-center"
                        >
                          <div className="flex flex-col gap-1 ">
                           <input
                              ref={nameRef}
                              type="text"
                              defaultValue={room.name}
                              placeholder="room name..."
                              className="text-white p-1 rounded outline-none border border-gray-500"
                           />

                           <input
                              ref={DescRef}
                              type="text"
                              defaultValue={room.Desc}
                              placeholder="Description..."
                              className="text-white outline-none p-1 rounded border border-gray-500"
                           />
                           </div>
                           <button
                              type="submit"
                              className="cursor-pointer text-white  bg-blue-600 p-1 rounded-xl"
                           >
                              Update
                           </button>

                        </form>
                      
                      :
                      <>
                      <h1 className="text-xl font-bold">{room.name}</h1>
                      <span className="text-xs">{room.Desc}</span>
                      </>
                      }
                    </div>
                      <div className="absolute top-1 right-3 flex gap-4">
                      <Edit onClick={(e)=>{
                        e.stopPropagation();
                        setEditingRoomId(
                         editingRoomId === room.id
                                 ? null
                                   : room.id
                         )
                        
                      }} className="w-5 h-5 hover:scale-105"/>
                      <Trash2  onClick={(e)=>{
                        e.stopPropagation();
                        DeleteRoom(room.id);
                        }} className="w-5 h-5 hover:scale-105"/>
                   </div>
                 </div>
                 ))}
                 </div>
              </div>

            </div>
          )}
        {show && <RoomInput setShow={setShow} />}
        </>

  );
}