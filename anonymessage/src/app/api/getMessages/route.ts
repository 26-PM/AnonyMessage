import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user || !_user._id) {
        return new Response(JSON.stringify({
            success: false,
            message: "Not authenticated."
        }), { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $project: { messages: { $slice: ['$messages', -10] } } }, // Limit to last 10 messages
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
        ]).exec();

        if (!user || user.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found."
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            messages: user[0].messages
        }), { status: 200 });

    } catch (error) {
        console.error("An unexpected error occurred.", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Failed to retrieve user messages."
        }), { status: 500 });
    }
}
