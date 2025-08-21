import { connectDb } from "@/lib/db";
import User from "@/models/user";



export async function POST(req) {
    
    const { name, url, email } = await req.json();
    
    

    if(!name || !url) {
        return new Response(JSON.stringify({ error: "Name and URL are required" }), { status: 400 });
    }
    try {
        await connectDb();
        const user = await User.findOne({email})
        if(!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }
        user.links.push({name, url})
        user.save()
        return new Response(JSON.stringify({ message: "Link added successfully", links: user.links }), { status: 201 });
    } catch (error) {
        console.error("Error adding link:", error);
        return new Response(JSON.stringify({ error: "Failed to add link" }), { status: 500 });
    }
}