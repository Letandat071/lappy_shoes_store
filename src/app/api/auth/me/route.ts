import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email })
      .select("-password")
      .lean();

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        user: {
          ...user,
          _id: user._id.toString(),
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
} 