import { NextResponse } from "next/server";
import prisma from "../../../app/lib/db";
import slugify from "slugify";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const BUCKET = "uploads";

// CREATE Model
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const model_name = formData.get("model_name") as string;
    const model_age = formData.get("model_age") as string;
    const model_location = formData.get("model_location") as string;
    const model_desc = formData.get("model_desc") as string;

    console.log("Received data:", { model_name, model_age, model_location, model_desc });

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

    let imageUrl = null;

    // Upload image to Supabase Storage
    if (file && file.type.startsWith("image/")) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `models/model-${Date.now()}.${file.type.split("/")[1]}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, buffer, { contentType: file.type });

      if (error) {
        console.error("Supabase upload error:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
      }

      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      imageUrl = publicData.publicUrl;
    }

    // Generate unique slug
    let baseSlug = slugify(model_name, { lower: true, strict: true, trim: true });
    if (baseSlug.length > 200) baseSlug = baseSlug.slice(0, 200);

    let slug = baseSlug;
    let count = 1;
    while (true) {
      const existing = await prisma.model.findUnique({ where: { slug }, select: { id: true } });
      if (!existing) break;
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // Create model in database
    const model = await prisma.model.create({
      data: {
        model_name,
        slug,
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
    console.error("Create model error:", error);
    return NextResponse.json({ error: "Failed to create model" }, { status: 500 });
  }
}

// READ All Models
export async function GET() {
  try {
    const models = await prisma.model.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      models,
    });
  } catch (error) {
    console.error("Fetch models error:", error);
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
  }
}