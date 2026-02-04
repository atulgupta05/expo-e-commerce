import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model";
import { ENV } from "../config/env.js";

export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const clerkId = req.auth();
            if(!clerkId){
                return res.status(401).json({message: "Unauthorized - Invalid Token"});
            }

            const user = await User.findOne({clerkId});
            if(!user){
                return res.status(401).json({message: "Unauthorized - User Not Found"});
            }

            req.user = user;
            next();

        } catch (error) {
            console.error("Error in protectRoute middleware", error);
            return res.status(500).json({message: "Internal Server Error"});
        }

    }

];

export const adminOnly = (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}