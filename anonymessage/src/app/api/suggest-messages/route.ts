import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { stat } from 'fs';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const prompt = "Create a list of 3 open ended and engaging questions formatted as a single string . Each question should be separated by '||'. These questions are for an anonymous social messaging platform like qooh.me.";

        // Ask OpenAI for a streaming chat completion given the prompt
        const response = await openai.completions.create({
            model: 'gpt-3.5-turbo-instruct',
            max_tokens: 200,
            stream: true,
            prompt,
          });

        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(response);
        // Respond with the stream
        return new StreamingTextResponse(stream);
    }
    catch(error){
        if(error instanceof OpenAI.APIError){
            const {name,status,headers,message}=error;
            return NextResponse.json({
                name,status,headers,message
            },{status:status})

        }else{
            console.error("An unexpected error occured.",error);
            throw error;
        }
    }
}