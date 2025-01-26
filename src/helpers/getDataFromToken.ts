import { NextRequest } from "next/server";
import * as jose from 'jose';

export const getDataFromToken = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    // console.log("Token received:", token);
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    // console.log("Decoded payload:", payload);
    
    return payload.userId;
  } catch (error: any) {
    console.error("Error decoding token:", error);
    return null;
  }
}; 