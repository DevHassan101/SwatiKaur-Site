import { NextResponse } from "next/server";
import prisma from "../../../app/lib/db";
import slugify from "slugify";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const BUCKET = "uploads";

// CREATE Blog
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const blog_name = formData.get("blog_name") as string;
    const blog_desc = formData.get("blog_desc") as string;
    const blog_date = formData.get("blog_date") as string;

    console.log("Received data:", { blog_name, blog_desc, blog_date });

    if (!blog_name || !blog_desc || !blog_date) {
      return NextResponse.json(
        { error: "Blog name, description and date are required" },
        { status: 400 }
      );
    }

    // 1️⃣ Generate base slug from blog_name
    let baseSlug = slugify(blog_name, {
      lower: true,
      strict: true,
      trim: true
    });

    // Limit slug length
    if (baseSlug.length > 200) {
      baseSlug = baseSlug.slice(0, 200);
    }

    // 2️⃣ Ensure slug is unique
    let slug = baseSlug;
    let count = 1;

    while (true) {
      const existing = await prisma.blog.findUnique({
        where: { slug },
        select: { id: true }
      });

      if (!existing) break;

      slug = `${baseSlug}-${count}`;
      count++;
    }

    let imageUrl = null;

    // Upload image to Supabase Storage
    if (file && file.type.startsWith("image/")) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `blogs/blog-${Date.now()}.${file.type.split("/")[1]}`;

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

    // 3️⃣ Create blog in database with auto-generated slug
    const blog = await prisma.blog.create({
      data: {
        blog_name,
        slug, // Auto-generated slug
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
    console.error("Create blog error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

// READ All Blogs
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Fetch blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}