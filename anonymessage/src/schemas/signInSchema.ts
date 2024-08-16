// import {z}from "zod";

// export const signInSchema=z.object({
//     identifier:z.string({required_error:"Email is required"}).email({message:"Invalid email"})
//     ,password:z.string({required_error:"Password is required"})  
// })

import * as z from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(1, "Username or Email is required").refine(value => {
    // Regex to check if it's a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || /^[a-zA-Z0-9_]+$/.test(value); // Either a valid email or a valid username
  }, "Invalid email or username"),
  password: z.string().min(1, "Password is required"),
});
