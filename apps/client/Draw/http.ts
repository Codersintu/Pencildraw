
import { BACKEND_URL } from "@repo/common-data/index"
import axios from "axios"
import { ShapeData } from "./CanvasEngine";

export  async function existingCanvasShape(roomId: string,token:string) {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/room/draw/${roomId}`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    return response.data.shapes.map(
      (x:{message:string})=>JSON.parse(x.message).shapes
    );

  } catch (err) {
    console.error("Failed to fetch shapes", err)
    return []
  }
}