import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quote, personName, relationship, personalContext } = body;

    if (!quote || !personName || !relationship) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const contextSection = personalContext 
      ? `\n\nAdditional context about ${personName} and our relationship:\n${personalContext}`
      : '';

    const prompt = `You are a thoughtful and eloquent writer helping someone craft meaningful vows or a personal letter. 

The user wants to write vows for their ${relationship} named ${personName}. They've chosen a seed quote to inspire their writing:

"${quote.text}" - ${quote.author}${contextSection}

Please write heartfelt, genuine vows that:
1. Acknowledge the seed quote and how it relates to their relationship
2. Express deep, authentic feelings without being overly flowery
3. Include specific promises about growth, support, and partnership
4. Are personal and meaningful, not generic - weave in the specific context provided when available
5. Reference the wisdom of the philosopher/author in a natural way
6. Keep the tone warm, genuine, and from the heart
${personalContext ? '7. Incorporate the personal details provided to make the vows truly unique and specific to this relationship' : ''}

Write in a letter format addressing ${personName}. The vows should feel personal and sincere, drawing inspiration from the quote while expressing genuine commitment and love.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a thoughtful and eloquent writer specializing in crafting meaningful vows and personal letters.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 1000,
    });

    const generatedVows = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ vows: generatedVows });
  } catch (error) {
    console.error("Error generating vows:", error);
    return NextResponse.json(
      { error: "Failed to generate vows. Please try again." },
      { status: 500 }
    );
  }
}

