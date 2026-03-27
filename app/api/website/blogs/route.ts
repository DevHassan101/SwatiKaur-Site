import { NextResponse } from "next/server";
import prisma from "../../../lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");

    const limit = limitParam ? Number(limitParam) : undefined;

    const blogs = await prisma.blog.findMany({
      take: limit,
      select: {
        id: true,
        blog_name: true,
        slug: true,
        blog_desc: true,
        blog_image: true,
        blog_date: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      { success: true, blogs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Website blogs error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
