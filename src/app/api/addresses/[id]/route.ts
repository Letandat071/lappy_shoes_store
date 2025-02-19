// src/app/api/addresses/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import Address from "@/models/Address";
import User from "@/models/User";

interface AddressParams {
  params: {
    id: string;
  };
}

/**
 * Handler PUT: Cập nhật địa chỉ.
 * @param request - Đối tượng NextRequest chứa thông tin request.
 * @param context - Tham số thứ hai được khai báo là unknown, sau đó ép sang kiểu mong muốn.
 */
export async function PUT(
  request: NextRequest,
  context: AddressParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    const { id } = context.params;
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Address ID is required" }), 
        { status: 400 }
      );
    }

    const body = await request.json();

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      );
    }

    const address = await Address.findOneAndUpdate(
      { _id: id, user: user._id },
      body,
      { new: true }
    );

    if (!address) {
      return new NextResponse(
        JSON.stringify({ error: "Address not found" }), 
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ address }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/addresses/[id]:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}

/**
 * Handler DELETE: Xóa địa chỉ.
 * @param request - Đối tượng NextRequest chứa thông tin request.
 * @param context - Tham số thứ hai được khai báo là unknown, sau đó ép sang kiểu mong muốn.
 */
export async function DELETE(
  request: NextRequest,
  context: AddressParams
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    const { id } = context.params;
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Address ID is required" }), 
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User not found" }), 
        { status: 404 }
      );
    }

    const address = await Address.findOneAndDelete({ 
      _id: id, 
      user: user._id 
    });

    if (!address) {
      return new NextResponse(
        JSON.stringify({ error: "Address not found" }), 
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/addresses/[id]:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }), 
      { status: 500 }
    );
  }
}
