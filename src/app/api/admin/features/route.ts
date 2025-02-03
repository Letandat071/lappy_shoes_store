import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Feature from "@/models/Feature";

// Get all features
export async function GET() {
  try {
    await connectDB();
    const features = await Feature.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ features }, { status: 200 });
  } catch (error: unknown) {
    console.error("GET Features Error:", error);
    let message = "Internal Server Error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Create new feature
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);

    // Validate required fields
    const { name } = body;
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Check if feature with same name exists
    const existingFeature = await Feature.findOne({ name });
    if (existingFeature) {
      return NextResponse.json(
        { error: "Feature with this name already exists" },
        { status: 400 }
      );
    }

    // Create new feature
    const feature = await Feature.create({
      name,
      description: body.description || "",
      icon: body.icon || ""
    });

    console.log("Created feature:", feature);
    return NextResponse.json({ feature }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST Feature Error:", error);
    let message = "Internal Server Error";
    if (error instanceof Error) message = error.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Update feature
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);

    // Validate required fields
    const { id, name } = body;
    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    // Check if feature exists
    const existingFeature = await Feature.findById(id);
    if (!existingFeature) {
      return NextResponse.json(
        { error: "Feature not found" },
        { status: 404 }
      );
    }

    // Check if new name conflicts with other features
    if (name !== existingFeature.name) {
      const nameConflict = await Feature.findOne({ name, _id: { $ne: id } });
      if (nameConflict) {
        return NextResponse.json(
          { error: "Feature with this name already exists" },
          { status: 400 }
        );
      }
    }

    // Update feature
    const feature = await Feature.findByIdAndUpdate(
      id,
      {
        name,
        description: body.description || "",
        icon: body.icon || "",
        updatedAt: Date.now()
      },
      { new: true }
    );

    console.log("Updated feature:", feature);
    return NextResponse.json({ feature }, { status: 200 });
  } catch (error: unknown) {
    console.error("PUT Feature Error:", error);
    let message = "Internal Server Error";
    if (error instanceof Error) message = error.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Delete feature
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Feature ID is required" },
        { status: 400 }
      );
    }

    const feature = await Feature.findByIdAndDelete(id);
    if (!feature) {
      return NextResponse.json(
        { error: "Feature not found" },
        { status: 404 }
      );
    }

    console.log("Deleted feature:", feature);
    return NextResponse.json(
      { message: "Feature deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE Feature Error:", error);
    let message = "Internal Server Error";
    if (error instanceof Error) message = error.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 