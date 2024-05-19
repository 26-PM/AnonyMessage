import {getServerSession} from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { User } from "next-auth"
import mongoose from "mongoose"

export async function GET(request:Request){
    await dbConnect();

    const session=await getServerSession(authOptions);
    const _user:User=session?.user as User;

    if (!session ||!_user){
        return Response.json(
            {
                success: false,
                message: "Not authenticated."
            },
            {status: 401}
        )   
    }
    const userId=new mongoose.Types.ObjectId(_user._id);
    try {
        const user= await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$limit:10},
            {$group:{_id:'_$id',messages:{$push:'$messages'}}}
        ]).exec();

        if (!user || user.length===0){
            return Response.json(
                {
                    success: false,
                    message: "User not found."
                },
                {status: 404}
            )   
        }
        return Response.json(
            {
                messages: user[0].messages
            },
            {status: 200},
        ); 
    } catch (error) {
        console.log("An unexpected error occured.",error);
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages."
            },
            {status: 500}   
        )  
    }
}