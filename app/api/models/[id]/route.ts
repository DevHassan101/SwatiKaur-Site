import { NextResponse } from "next/server";
import prisma from "../../../../app/lib/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const BUCKET = "uploads";

function extractStoragePath(publicUrl: string): string | null {
  try {
    const marker = `/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return publicUrl.slice(idx + marker.length);
  } catch {
    return null;
  }
}

// GET - Fetch single model
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const model = await prisma.model.findUnique({
      where: { id: Number(id) },
    });

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      model,
    });
  } catch (error) {
    console.error("Fetch model error:", error);
    return NextResponse.json({ error: "Failed to fetch model" }, { status: 500 });
  }
}

// UPDATE Model
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const formData = await request.formData();
    const file = formData.get("image") as File;
    const model_name = formData.get("model_name") as string;
    const model_age = formData.get("model_age") as string;
    const model_location = formData.get("model_location") as string;
    const model_desc = formData.get("model_desc") as string;

    if (!model_name || !model_age || !model_location || !model_desc) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const parsedAge = parseInt(model_age, 10);
    if (isNaN(parsedAge)) {
      return NextResponse.json(
        { error: "Age must be a valid number" },
        { status: 400 }
      );
    }

    // Get existing model
    const existingModel = await prisma.model.findUnique({
      where: { id: Number(id) },
    });

    if (!existingModel) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    let imageUrl = existingModel.model_image;

    // If new image is uploaded
    if (file && file.type.startsWith("image/")) {
      // Delete old image from Supabase if exists
      if (existingModel.model_image) {
        const oldPath = extractStoragePath(existingModel.model_image);
        if (oldPath) {
          const { error: deleteError } = await supabase.storage
            .from(BUCKET)
            .remove([oldPath]);
          if (deleteError) {
            console.warn("Failed to delete old image from Supabase:", deleteError.message);
          }
        }
      }

      // Upload new image to Supabase
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `models/model-${Date.now()}.${file.type.split("/")[1]}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, buffer, { contentType: file.type });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
      }

      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      imageUrl = publicData.publicUrl;
    }

    // Update model
    const model = await prisma.model.update({
      where: { id: Number(id) },
      data: {
        model_name,
        model_age: parsedAge,
        model_location,
        model_desc,
        model_image: imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      model,
    });
  } catch (error) {
    console.error("Update model error:", error);
    return NextResponse.json({ error: "Failed to update model" }, { status: 500 });
  }
}

// DELETE Model
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get model to delete image
    const model = await prisma.model.findUnique({
      where: { id: Number(id) },
    });

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 });
    }

    // Delete image from Supabase if exists
    if (model.model_image) {
      const storagePath = extractStoragePath(model.model_image);
      if (storagePath) {
        const { error: deleteError } = await supabase.storage
          .from(BUCKET)
          .remove([storagePath]);
        if (deleteError) {
          console.warn("Failed to delete image from Supabase:", deleteError.message);
        }
      }
    }

    // Delete model from database
    await prisma.model.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Model deleted successfully",
    });
  } catch (error) {
    console.error("Delete model error:", error);
    return NextResponse.json({ error: "Failed to delete model" }, { status: 500 });
  }
}
