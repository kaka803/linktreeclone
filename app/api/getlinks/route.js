import User from "@/models/user";
import { connectDb } from "@/lib/db";

export async function POST(request) {
    const { email } = await request.json();
    
    if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }
    
    try {
        await connectDb();
        const user = await User.findOne({ email });
        
    
        if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }
        const links = user.links.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
        return new Response(JSON.stringify({ links: links, userData: user }), { status: 200 });
    } catch (error) {
        console.error("Error fetching links:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch links" }), { status: 500 });
    }
    }