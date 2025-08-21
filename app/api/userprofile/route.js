import User from "@/models/user";
import { connectDb } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { id } = await request.json()
        console.log("id:", id);
        
        await connectDb();
        const user = await User.findById(id)
        if(!user){
            return  NextResponse.json({error: 'user not found'}, {status: 404})
        }
        return  NextResponse.json({message: 'user found', user:user})
    } catch (e) {
        console.error("Error in POST request:", e);
        return  Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}