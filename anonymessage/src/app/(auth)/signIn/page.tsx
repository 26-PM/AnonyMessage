"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"


const page = () => { 
  const [isSubmitting, setisSubmitting] = useState(false)

  // shadcn
  const { toast } = useToast()
  // next
  const router = useRouter();
  

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema >>({
    resolver: zodResolver(signInSchema),
    defaultValues: { 
      identifier : "",
      password: ""
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
     const result= await signIn ("credentials", {
      redirect:false,
      identifier:data.identifier,
      password:data.password 
     })
     if (result?.error) {
      toast ({
        title: "Error",
        description: "Incorrect username or password."
      })
     }
     else{
      toast({
        title: "Success",
        description: "You have successfully logged in."
      })
     }

     if(result?.url){
      router.replace( '/dashboard') 
     }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join anonyMessage
          </h1>
          <p className="mb-4">Sign in  to start your anonymous adventure.</p>
        </div>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}> 
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username </FormLabel>
                  <FormControl>
                    <Input placeholder="email/username " {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} type="submit">
           Sign In
              </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page 