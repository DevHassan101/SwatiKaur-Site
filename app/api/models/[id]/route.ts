import { NextResponse } from "next/server";
import prisma from "../../../../app/lib/db";
import { promises as fs } from "fs";
import path from "path";

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
      // Delete old image if exists
      if (existingModel.model_image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingModel.model_image
        );
        try {
          await fs.unlink(oldImagePath);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          console.warn("Old image not found, skipping delete");
        }
      }

      // Upload new image
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads/models");
      await fs.mkdir(uploadDir, { recursive: true });
      const fileName = `model-${Date.now()}.${file.type.split("/")[1]}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      imageUrl = `/uploads/models/${fileName}`;
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

    // Delete image if exists
    if (model.model_image) {
      const imagePath = path.join(process.cwd(), "public", model.model_image);
      try {
        await fs.unlink(imagePath);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.warn("Image not found, skipping delete");
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