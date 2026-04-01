import { NextResponse } from "next/server";
import prisma from "../../../../app/lib/db";
import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";

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

// GET - Fetch single blog
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id: Number(id) },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Fetch blog error:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

// UPDATE Blog
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const formData = await request.formData();
    const file = formData.get("image") as File;
    const blog_name = formData.get("blog_name") as string;
    const blog_desc = formData.get("blog_desc") as string;
    const blog_date = formData.get("blog_date") as string;

    if (!blog_name || !blog_desc || !blog_date) {
      return NextResponse.json(
        { error: "Blog name, description and date are required" },
        { status: 400 }
      );
    }

    // Get existing blog
    const existingBlog = await prisma.blog.findUnique({
      where: { id: Number(id) },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Regenerate slug if blog_name changed
    let slug = existingBlog.slug;

    if (blog_name !== existingBlog.blog_name) {
      let baseSlug = slugify(blog_name, {
        lower: true,
        strict: true,
        trim: true,
      });

      if (baseSlug.length > 200) {
        baseSlug = baseSlug.slice(0, 200);
      }

      slug = baseSlug;
      let count = 1;

      while (true) {
        const existing = await prisma.blog.findUnique({
          where: { slug },
          select: { id: true },
        });

        if (!existing || existing.id === Number(id)) break;

        slug = `${baseSlug}-${count}`;
        count++;
      }
    }

    let imageUrl = existingBlog.blog_image;

    // If new image is uploaded
    if (file && file.type.startsWith("image/")) {
      // Delete old image from Supabase if exists
      if (existingBlog.blog_image) {
        const oldPath = extractStoragePath(existingBlog.blog_image);
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
      const fileName = `blogs/blog-${Date.now()}.${file.type.split("/")[1]}`;

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

    // Update blog
    const blog = await prisma.blog.update({
      where: { id: Number(id) },
      data: {
        blog_name,
        slug,
        blog_desc,
        blog_image: imageUrl,
        blog_date: new Date(blog_date + "T00:00:00.000Z"),
      },
    });

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// DELETE Blog
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id: Number(id) },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Delete image from Supabase if exists
    if (blog.blog_image) {
      const storagePath = extractStoragePath(blog.blog_image);
      if (storagePath) {
        const { error: deleteError } = await supabase.storage
          .from(BUCKET)
          .remove([storagePath]);
        if (deleteError) {
          console.warn("Failed to delete image from Supabase:", deleteError.message);
        }
      }
    }

    // Delete blog from database
    await prisma.blog.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
