import { NextResponse } from "next/server";
import prisma from "../../../../app/lib/db";
import { promises as fs } from "fs";
import path from "path";
import slugify from "slugify";

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

    // 1️⃣ Regenerate slug if blog_name changed
    let slug = existingBlog.slug;

    if (blog_name !== existingBlog.blog_name) {
      let baseSlug = slugify(blog_name, {
        lower: true,
        strict: true,
        trim: true
      });

      if (baseSlug.length > 200) {
        baseSlug = baseSlug.slice(0, 200);
      }

      slug = baseSlug;
      let count = 1;

      while (true) {
        const existing = await prisma.blog.findUnique({
          where: { slug },
          select: { id: true }
        });

        // If slug doesn't exist OR it's the same blog being updated
        if (!existing || existing.id === Number(id)) break;

        slug = `${baseSlug}-${count}`;
        count++;
      }
    }

    let imageUrl = existingBlog.blog_image;

    // If new image is uploaded
    if (file && file.type.startsWith("image/")) {
      // Delete old image if exists
      if (existingBlog.blog_image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingBlog.blog_image
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.warn("Old image not found, skipping delete");
        }
      }

      // Upload new image
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads/blogs");
      await fs.mkdir(uploadDir, { recursive: true });
      const fileName = `blog-${Date.now()}.${file.type.split("/")[1]}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      imageUrl = `/uploads/blogs/${fileName}`;
    }

    // 2️⃣ Update blog with new slug
    const blog = await prisma.blog.update({
      where: { id: Number(id) },
      data: {
        blog_name,
        slug, // Updated slug
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

    // Delete image if exists
    if (blog.blog_image) {
      const imagePath = path.join(process.cwd(), "public", blog.blog_image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.warn("Image not found, skipping delete");
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