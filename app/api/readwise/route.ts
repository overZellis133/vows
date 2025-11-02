import { NextRequest, NextResponse } from "next/server";
import { fetchReadwiseHighlightsPaginated } from "@/lib/readwise";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Readwise API key is required" },
        { status: 400 }
      );
    }

    const highlights = await fetchReadwiseHighlightsPaginated(apiKey);

    return NextResponse.json({ highlights });
  } catch (error) {
    console.error("Error fetching Readwise highlights:", error);
    return NextResponse.json(
      { error: "Failed to fetch Readwise highlights" },
      { status: 500 }
    );
  }
}

