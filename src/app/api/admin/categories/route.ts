import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Get all categories
export async function GET() {
  try {
    await connectDB();
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
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
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
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id, name, description, image, isHighlight } = await request.json();
    
    // Update slug if name is changed
    const slug = name.toLowerCase().replace(/ /g, "-");
    
    // console.log('Updating category:', { id, name, isHighlight });
    
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
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // console.log('Updated category:', updatedCategory);

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
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await connectDB();
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    let message = "Unknown error!";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 