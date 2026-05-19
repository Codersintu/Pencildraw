import { RoomSchema } from "@repo/backend-common/type";
import { JWT_SECRET } from "@repo/common-data/index";
import { client } from "@repo/db/index";
import express, { Router } from "express";
import jwt from "jsonwebtoken"
import { userMiddleware } from "../middleware/user.middleware.js";
const router: Router = express.Router();


router.post("/token",async(req,res)=>{
    try {
        const {userId}=req.body;
        if(!userId){
            return res.status(400).json({error:"User ID is required"});
        }
        const token=jwt.sign({userId},JWT_SECRET)
        return res.status(200).json({token});
    } catch (error) {
        return res.status(500).json({error: "Failed to generate token"});
    }
})
router.post("/create",userMiddleware,async (req:any,res:any)=>{
    try {
        const userId=req.userId ;
       const parsedData=RoomSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({error: parsedData.error.issues[0]?.message});
    }

    const {name,desc}=parsedData.data;
    const existingRoom=await client.room.findFirst({
        where:{
            name:name,
            adminId:userId
        }
    })
    if(existingRoom){
        return res.status(400).json({error:"You already have a room with this name"});
    }
    
    const newRoom=await client.room.create({
        data:{
            name:name,
            Desc:desc || "",
            adminId:userId
        }
    })

    return res.status(201).json({room:newRoom});
    } catch (error) {
        return res.status(500).json({error: "Failed to create room"});
    }

})

router.get("/rooms",userMiddleware,async (req:any,res:any)=>{
    try {
        const userId=req.userId;
        const rooms=await client.room.findMany({
        where:{
            adminId:userId
        },
        orderBy:{
          id:"desc"
        }
    })
    return res.status(200).json({rooms});

    } catch (error) {
        return res.status(500).json({error: "Failed to fetch rooms"});
    }
})

//delete room

router.delete("/delete/:roomId",userMiddleware,async (req: any, res: any) => {

    try {

      const userId = Number(req.userId);

      const roomId = Number(req.params.roomId);

      if (!userId || !roomId) {
        return res.status(400).json({
          message: "credentials missing!"
        });
      }

       await client.draw.deleteMany({
        where: {
          roomId: roomId,
        }
      });


      await client.room.deleteMany({
        where: {
          id: roomId,
          adminId: userId
        }
      });

      return res.status(200).json({
        message: "Room has been deleted successfully!"
      });

    } catch (error) {


      return res.status(500).json({
        message: "Deletion has been failed!"
      });

    }
});

//update room name

router.put( "/update/:roomId", userMiddleware,async (req: any, res: any) => {

    try {

      const roomId =
        Number(req.params.roomId);

      const userId =
        Number(req.userId);

      const { name,Desc } = req.body;

      if (!userId || !roomId) {

        return res.status(400).json({
          message: "credentials missing!"
        });
      }

      if (!name || name.trim() === "") {

        return res.status(400).json({
          message: "Room name is required"
        });
      }

      // verify room ownership
      const existingRoom =
        await client.room.findFirst({
          where: {
            id: roomId,
            adminId: userId
          }
        });

      if (!existingRoom) {

        return res.status(404).json({
          message: "Room not found"
        });
      }

      // update room
      const updatedRoom =
        await client.room.update({
          where: {
            id: roomId
          },

          data: {
            name: name,
            Desc:Desc
          }
        });

      return res.status(200).json({
        message: "Room updated successfully",
        room: updatedRoom
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        message: "Failed to update room"
      });
    }
});

// getting chat history for a room
router.get("/draw/:roomId",userMiddleware,async (req:any,res:any)=>{
    try {
        const userId=Number(req.userId);
        const roomId=Number(req.params.roomId);
        const shapes=await client.draw.findMany({
            where:{
                roomId:roomId,
                adminId:userId
            },
            orderBy:{
                id:"asc"
            },
            take:1000

        });
        return res.status(200).json({shapes});
    } catch (error) {
        console.error("Error fetching drawing history:", error);
        return res.status(500).json({error: "Failed to fetch Drawing history"});
    }

})


export default router;