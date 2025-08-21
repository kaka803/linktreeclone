import User from "@/models/user";
import { connectDb } from "@/lib/db";

export async function POST(request) {
  const { name, username, email, bio, avatarUrl, links } = await request.json();

  if (!name || !username || !email || !bio) {
    return new Response(
      JSON.stringify({ error: "All fields are required" }),
      { status: 400 }
    );
  }

  try {
    await connectDb();

    
    const updatedUser = await User.findOneAndUpdate(
      { email }, 
      {
        $set: {
          name,
          username,
          bio,
          profilePic: avatarUrl,
          links: links || [],
        },
      },
      {
        new: true, 
        upsert: true, 
      }
    );

    return new Response(
      JSON.stringify({ message: "User saved/updated successfully", user: updatedUser }),
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
