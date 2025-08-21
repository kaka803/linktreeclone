import User from "@/models/user";
import { connectDb } from "@/lib/db";

export async function POST(request) {
    const { email, imageUrl } = await request.json();

    console.log(email, imageUrl);
    
    
    if (!email || !imageUrl) {
        return new Response(
        JSON.stringify({ error: "Email and profile picture URL are required" }),
        { status: 400 }
        );
    }
    
    try {
        await connectDb();
    
        const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: { profilePic: imageUrl } },
        { new: true, upsert: true }
        );
    
        return new Response(
        JSON.stringify({ message: "Profile picture updated successfully", user: updatedUser }),
        { status: 200 }
        );
    } catch (e) {
        console.error(e);
        return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500 }
        );
    }
}