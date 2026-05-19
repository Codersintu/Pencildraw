import { JWT_SECRET } from "@repo/common-data/index";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}
export const userMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
    const authHeader=req.headers.authorization;
    console.log("Authorization header:", authHeader);
    if(!authHeader){
        return res.status(401).json({error:"Authorization header missing"});
    }

    const token=authHeader.split(" ")[1];

    const decode=await jwt.verify(token || "",JWT_SECRET) ;
    console.log("Decoded token:", decode);
    if(!decode || typeof decode === "string"){
        return res.status(401).json({error:"Invalid token"});
    }
    req.userId=decode.userId;
    console.log("User ID set in request object:", req.userId);
    next();


}