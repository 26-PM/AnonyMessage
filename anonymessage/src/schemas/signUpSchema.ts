import {z}from "zod";

export const usernameValidation=z
.string() 
.min(2,"Username must be of 2 characters.")
.max(10,'Username can be maximum of 10 characters.')
.regex( /[a-zA-Z0-9]/,"Username can only contain letters and numbers.  ")

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address."}),
    password:z.string()
})