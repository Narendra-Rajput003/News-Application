import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../utils/responseHandler.js";



export const authMiddleware=async(req,res,next)=>{
    try {
        const token = req.cookies.token 
        || req.body.token 
        || req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            return res.status(401).send({ error: "Please authenticate." });
            }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded
        
        next()
    } catch (error) {
        console.log("error in auth middleware",error)
        return errorResponse(res,error,'error in auth middleware ',500);        
    }
}