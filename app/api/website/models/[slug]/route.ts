import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const model = await prisma.model.findFirst({
      where: {
        slug: slug,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      model,
    });
  } catch (error) {
    console.error("Fetch model details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch model details" },
      { status: 500 }
    );
  }
}
