import { NextResponse } from "next/server";
import prisma from "@/app/lib/db"; 

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      orderBy: {
        createdAt: "desc",
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