import User from "@/models/user";
import { connectDb } from "@/lib/db";

export async function POST(request) {
  try {
    const { email, linkId } = await request.json();
    await connectDb();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const linkIndex = user.links.findIndex(
      (link) => link._id.toString() === linkId
    );
    if (linkIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, message: "Link not found" }),
        { status: 404 }
      );
    }

    user.links.splice(linkIndex, 1);
    await user.save();

    return new Response(
      JSON.stringify({ success: true, message: "Link deleted successfully" }),
      { status: 200 }
    );
  } catch (e) {
    console.error("Error in POST request:", e);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
