"use client";
import { useForm } from "react-hook-form"
import axios from "axios"
import { BACKEND_URL } from "@repo/common-data/index";
import { Loader } from "lucide-react";
import { useBackendToken } from "@/component/config";
import { useRouter } from "next/navigation";

type dataProps={
    name:string,
    desc?:string
}
export default function RoomInput({setShow}:{setShow:(val:boolean)=>void}) {
    const {register,handleSubmit,setError,formState:{errors,isSubmitting}}=useForm<dataProps>();
    const {data:token}=useBackendToken();
    const router=useRouter();
    const onSubmit=async(data:dataProps)=>{
        try {
           
            if (!token) {
                setError("root", { message: "Failed to get backend token" });
                return;
            }
            
            const response=await axios.post(`${BACKEND_URL}/api/room/create`,data,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
           
           
            router.push(`canvas/${response.data.room.id}`);
        } catch (error: any) {
            setError("root",{message:error?.response?.data?.error || "Failed to create room"})
        }
    }
    
    return (
            
        <div className="min-h-screen w-full bg-black/50 absolute top-0 left-0 flex justify-center items-center z-50">

            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl rounded-lg bg-linear-to-r from-[#2D3844] via-[#62240C] to-[#62240C]">
            <svg onClick={()=>setShow(false)} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="w-8 h-8 float-right m-5 cursor-pointer bg-gray-400 rounded-full" viewBox="0 0 50 50">
              <path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"></path>
            </svg>
                <div className="p-10">
                <h1 className="text-2xl font-bold text-gray-300 mb-5">Create New Room</h1>
                <div className="flex flex-col gap-2 mb-4">
                <input type="text" placeholder="Room Name" className="w-full px-4 py-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                {...register("name",{required:"Room name is required"})}
                />
                 {errors.name && (
                     <p className="text-red-500">
                         {typeof errors.name?.message === 'string' ? errors.name.message : 'Invalid input'}
                     </p>
                 )}
                 </div>
                 <div className="flex flex-col gap-2 mb-4">
                <textarea placeholder="Description (optional)" className="w-full px-4 py-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("desc",{maxLength:{value:50,message:"Description cannot exceed 50 characters"}})}
                />
                {errors.desc && (
                    <p className="text-red-500">
                        {typeof errors.desc?.message === 'string' ? errors.desc.message : 'Invalid input'}
                    </p>
                )}
            </div>
                {errors.root && (
                    <p className="text-red-500 mb-4">
                        {typeof errors.root?.message === 'string' ? errors.root.message : 'Failed to create room'}
                    </p>
                )}
                <button disabled={isSubmitting} className="bg-blue-700 w-full px-30 py-4 text-white font-semibold rounded-2xl cursor-pointer" type="submit">{isSubmitting ? <Loader className="animate-spin w-full" /> : "Create room"}</button>
                </div>
            </form>

        </div>
    )
}