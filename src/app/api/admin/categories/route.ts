import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";

// Hàm kiểm tra admin token
async function verifyAdminToken(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value || "";
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jose.jwtVerify(token, secret);
    return payload.adminId;
  } catch (error) {
    console.error("Error verifying admin token:", error);
    return null;
  }
}

// Get all categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await Category.find({})
      .select('_id name slug description image isActive isHighlight createdAt updatedAt')
      .sort({ createdAt: -1 });

    // Chuyển đổi Mongoose Document thành plain object và đảm bảo có trường isHighlight
    const formattedCategories = categories.map(cat => ({
      ...cat.toObject(),
      isHighlight: Boolean(cat.isHighlight),
      isActive: Boolean(cat.isActive)
    }));

    return NextResponse.json({ categories: formattedCategories }, { status: 200 });
  } catch (error: unknown) {
    let message = "Unknown error!";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Create new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, image, isHighlight } = await request.json();
    
    // Create slug from name
    const slug = name.toLowerCase().replace(/ /g, "-");
    
    const category = await Category.create({
      name,
      slug,
      description,
      image,
      isHighlight: isHighlight || false
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: unknown) {
    let message = "Unknown error!";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Update category
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, description, image, isHighlight } = await request.json();
    
    // Update slug if name is changed
    const slug = name.toLowerCase().replace(/ /g, "-");
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { 
        name, 
        slug, 
        description, 
        image, 
        isHighlight: isHighlight,
        updatedAt: Date.now() 
      },
      { new: true }
    )
    .select('_id name slug description image isActive isHighlight createdAt updatedAt')
    .lean();

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Format response để đảm bảo trường isHighlight được trả về đúng
    const formattedCategory = {
      ...updatedCategory,
      isHighlight: Boolean(updatedCategory.isHighlight),
      isActive: Boolean(updatedCategory.isActive)
    };

    return NextResponse.json({ category: formattedCategory }, { status: 200 });
  } catch (error: unknown) {
    console.error('Update error:', error);
    let message = "Unknown error!";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Delete category
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    let message = "Unknown error!";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 