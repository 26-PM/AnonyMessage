"use client"
import * as React from "react"
 
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"

const Home = () => {
  return (
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'><h1 className='text-3xl md:text-4xl font-bold'>Dive into the Anonymous World.</h1>
      <p>Explore Anony Message</p></section>
      <Carousel plugins={[Autoplay({delay:2000})]} className="w-full max-w-xs">
      <CarouselContent>
        {
          messages.map((message,index)=>(<CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
  )
}

export default Home