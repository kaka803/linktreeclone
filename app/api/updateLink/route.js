import { connectDb } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, linkId, updatedLink } = await req.json();
    console.log("Update link request received:", email, linkId, updatedLink);

    await connectDb();

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const link = user.links.id(linkId);
    if (!link) {
      console.log("Link not found");
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    // update fields
    link.name = updatedLink.name;
    link.url = updatedLink.url;

    await user.save();

    // ✅ updated link return karo
    return NextResponse.json(link, { status: 200 });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
