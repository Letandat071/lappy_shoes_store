import { NextResponse } from "next/server";
import { getAdminFromToken } from "../../../../../lib/auth";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const admin = await getAdminFromToken();
    
    if (!admin) {
      return NextResponse.json({
        authenticated: false
      });
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      authenticated: false,
      error: "Failed to check authentication"
    });
  }
} 