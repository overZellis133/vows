// Readwise integration types and utilities

export interface ReadwiseHighlight {
  id: number;
  text: string;
  note?: string;
  location?: number;
  location_type?: string;
  highlighted_at?: string;
  url?: string;
  color?: string;
  updated?: string;
  book_id?: number;
  tags?: ReadwiseTag[];
  document?: ReadwiseDocument;
}

export interface ReadwiseDocument {
  id: number;
  url?: string;
  title?: string;
  author?: string;
  category?: string;
  source?: string;
  num_highlights?: number;
  updated?: string;
}

export interface ReadwiseTag {
  id: number;
  name: string;
}

export async function fetchReadwiseHighlights(apiKey: string): Promise<ReadwiseHighlight[]> {
  try {
    const response = await fetch("https://readwise.io/api/v2/highlights/", {
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Readwise highlights");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching Readwise highlights:", error);
    throw error;
  }
}

export async function fetchReadwiseHighlightsPaginated(
  apiKey: string,
  pageSize: number = 1000
): Promise<ReadwiseHighlight[]> {
  let allHighlights: ReadwiseHighlight[] = [];
  let nextCursor: string | null = null;

  do {
    const url: string = nextCursor
      ? `https://readwise.io/api/v2/highlights/?page_size=${pageSize}&page_cursor=${nextCursor}`
      : `https://readwise.io/api/v2/highlights/?page_size=${pageSize}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Readwise highlights");
      }

      const data = await response.json();
      allHighlights = [...allHighlights, ...(data.results || [])];
      
      // Extract cursor from next URL
      if (data.next) {
        try {
          const nextUrl = new URL(data.next);
          nextCursor = nextUrl.searchParams.get("page_cursor");
        } catch {
          nextCursor = null;
        }
      } else {
        nextCursor = null;
      }
    } catch (error) {
      console.error("Error fetching Readwise highlights:", error);
      throw error;
    }
  } while (nextCursor);

  return allHighlights;
}

