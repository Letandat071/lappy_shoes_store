import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Feature from "@/models/Feature";
import * as jose from 'jose';

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

// Get all features
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Kiểm tra quyền admin nếu request từ admin dashboard
    const isAdminRequest = request.headers.get('x-admin-request') === 'true';
    if (isAdminRequest) {
      const adminId = await verifyAdminToken(request);
      if (!adminId) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // Lấy query param để kiểm tra xem có cần filter isHighlight không
    const { searchParams } = new URL(request.url);
    const filterHighlight = searchParams.get('highlight') === 'true';

    const features = await Feature.find({
      // Chỉ filter isActive=true cho Navbar và các nơi khác
      isActive: true,
      // Thêm điều kiện isHighlight nếu cần
      ...(filterHighlight ? { isHighlight: true } : {})
    })
      .select('_id name description icon isHighlight isActive')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ features }, { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error("GET Features Error:", error);
    let message = "Internal Server Error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { 
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// Create new feature
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Kiểm tra quyền admin
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    // console.log("Request body:", body);

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

    // console.log("Created feature:", feature);
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

    // Kiểm tra quyền admin
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    // console.log("Request body:", body);

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
        $set: {
          name,
          description: body.description || "",
          icon: body.icon || "",
          isHighlight: body.isHighlight,
          updatedAt: Date.now()
        }
      },
      { new: true }
    );

    // Verify update was successful
    if (!feature) {
      throw new Error("Failed to update feature");
    }

    // Log để debug
    console.log("Updated feature:", {
      id,
      name,
      isHighlight: body.isHighlight,
      result: feature
    });

    return NextResponse.json({ feature }, { 
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("PUT Feature Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Delete feature
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Kiểm tra quyền admin
    const adminId = await verifyAdminToken(request);
    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    // console.log("Deleted feature:", feature);
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