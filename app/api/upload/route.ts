import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "uploads";

// POST - Upload image to Supabase Storage
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Valid image file is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.type.split("/")[1] || "jpg";
    const fileName = `upload-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: file.type });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    return NextResponse.json({ success: true, imageUrl: publicData.publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

// DELETE - Remove image from Supabase Storage
export async function DELETE(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    // Extract file name from full Supabase public URL
    const url = new URL(imageUrl);
    const parts = url.pathname.split(`/object/public/${BUCKET}/`);
    if (parts.length < 2) {
      return NextResponse.json({ error: "Invalid Supabase Storage URL" }, { status: 400 });
    }
    const fileName = parts[1];

    const { error } = await supabase.storage.from(BUCKET).remove([fileName]);

    if (error) {
      console.warn("Supabase delete warning:", error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
