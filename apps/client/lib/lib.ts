import { BACKEND_URL } from "@repo/common-data/index";
import axios from "axios";

export const getRooms=async({token}: { token: string })=>{
    const response=await axios.get(`${BACKEND_URL}/api/room/rooms`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    return response.data.rooms;
}
