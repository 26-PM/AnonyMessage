import { Content } from "next/font/google";
import {z}from "zod";

export const messageSchema=z.object({
    content  :z.string().min(6,"Content must be of atleast 6 characters. ").max(500,"Content must be less then 501 characters.") 
})