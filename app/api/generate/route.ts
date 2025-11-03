import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quote, personName, relationship, tone, personalContext, mode } = body;

    if (!quote || !personName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Relationship is optional for eulogy mode
    const isEulogy = mode === "eulogy";
    if (!isEulogy && !relationship) {
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
      ? `\n\nAdditional context about ${personName}${isEulogy ? ' and their life' : ' and our relationship'}:\n${personalContext}`
      : '';

    // Define tone-specific guidance
    const toneGuidance: Record<string, string> = {
      warm: "warm, romantic, and affectionate. Use tender language that expresses deep love and emotional connection.",
      formal: "formal, traditional, and dignified. Use elevated language and classic expressions of commitment, while maintaining sincerity.",
      playful: "playful, lighthearted, and fun. Include humor and whimsy while still expressing genuine commitment and love.",
      poetic: "poetic, lyrical, and beautifully crafted. Use rich imagery, metaphors, and rhythmic language to create something truly memorable.",
      sincere: "sincere, heartfelt, and authentic. Be direct and genuine without being flowery, focusing on honest expressions of love and commitment.",
      humorous: "humorous, witty, and entertaining. Include jokes, playful references, and light-hearted moments while still conveying real commitment."
    };

    const selectedTone = tone || (isEulogy ? "sincere" : "warm");
    const toneDescription = toneGuidance[selectedTone as keyof typeof toneGuidance] || toneGuidance.warm;

    let prompt: string;

    if (isEulogy) {
      prompt = `You are a thoughtful and eloquent writer helping someone craft a meaningful eulogy. 

The user wants to write a eulogy for ${personName}${relationship ? `, their ${relationship}` : ''}. They've chosen a seed quote to inspire their writing:

"${quote.text}" - ${quote.author}${contextSection}

Please write a heartfelt, genuine eulogy that:
1. Acknowledge the seed quote and how it relates to ${personName}'s life or character
2. Express deep, authentic feelings in a way that matches the requested tone: ${toneDescription}
3. Honor ${personName}'s memory with specific memories, qualities, or impact they had
4. Are personal and meaningful, not generic - weave in the specific context provided when available
5. Reference the wisdom of the philosopher/author in a natural way that connects to ${personName}'s life
6. Maintain the ${selectedTone} tone throughout while keeping the eulogy genuine and respectful
${personalContext ? `7. Incorporate the personal details provided to make the eulogy truly unique and specific to ${personName}` : ''}

Write in a format suitable for a eulogy. The eulogy should feel personal and sincere, drawing inspiration from the quote while honoring ${personName}'s memory in a ${selectedTone} tone.`;
    } else {
      prompt = `You are a thoughtful and eloquent writer helping someone craft meaningful vows or a personal letter. 

The user wants to write vows for their ${relationship} named ${personName}. They've chosen a seed quote to inspire their writing:

"${quote.text}" - ${quote.author}${contextSection}

Please write heartfelt, genuine vows that:
1. Acknowledge the seed quote and how it relates to their relationship
2. Express deep, authentic feelings in a way that matches the requested tone: ${toneDescription}
3. Include specific promises about growth, support, and partnership
4. Are personal and meaningful, not generic - weave in the specific context provided when available
5. Reference the wisdom of the philosopher/author in a natural way
6. Maintain the ${selectedTone} tone throughout while keeping the vows genuine and from the heart
${personalContext ? '7. Incorporate the personal details provided to make the vows truly unique and specific to this relationship' : ''}

Write in a letter format addressing ${personName}. The vows should feel personal and sincere, drawing inspiration from the quote while expressing genuine commitment and love in a ${selectedTone} tone.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: isEulogy 
            ? "You are a thoughtful and eloquent writer specializing in crafting meaningful eulogies that honor lives and memories."
            : "You are a thoughtful and eloquent writer specializing in crafting meaningful vows and personal letters.",
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

