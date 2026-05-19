import {WebSocket,WebSocketServer} from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-data/index";
import { client } from "@repo/db/index";
const wss=new WebSocketServer({port:8082});

type User={
    ws:WebSocket,
    rooms:number[],
    userId:number
}

async function getUserIdFromToken(token:string){
    try {
        const decode=await jwt.verify(token,JWT_SECRET) as {userId:number}
        return decode.userId;
    } catch (error) {
        throw new Error("Invalid token");
    }
}
const users:User[]=[];

wss.on("listening",()=>{
    console.log("WebSocket server is listening on port 8082");
})
wss.on("connection",async (ws,request)=>{
    const url=request.url;
    if(!url) return ws.close();

    const QueryParams=new URLSearchParams(url.split("?")[1]);
    const token=QueryParams.get("token");
    if(!token) return ws.close();

    const userId=await getUserIdFromToken(token);
    if(!userId) return ws.close();

    users.push({ws,rooms:[],userId});


    ws.on("message",async(data)=>{
        const paramsMessage=JSON.parse(data.toString());
        
        // JOIN ROOM
        if(paramsMessage.type==="join_room"){
           const user=users.find(u=>u.ws===ws);
           user?.rooms.push(Number(paramsMessage.roomId));
           console.log(users);
           console.log(
   "current ws",
   ws
);
        }

        //   LEAVE ROOM
        if(paramsMessage.type==="leave_room"){
            const user=users.find(u=>u.ws===ws);
            if(!user) return;
            user.rooms=user?.rooms.filter(room=>room !== Number(paramsMessage.roomId));
        }

        // BROADCAST MESSAGE TO ROOM
        if(paramsMessage.type==="broadcast"){
          const roomId=Number(paramsMessage.roomId);
          const message=paramsMessage.message;

          await client.draw.create({
            data:{
                roomId,
                message,
                adminId:userId
            }
          })


          users.forEach(user=>{
               if(user.rooms.includes(roomId)){
                  user.ws.send(JSON.stringify({
                     type:"broadcast",
                     roomId,
                     message
                  }));
               }
            });
 }
   
})


})
