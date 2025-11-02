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
  // Note: Readwise API doesn't include full book object in highlight responses
  // We need to fetch it separately using book_id
  book?: ReadwiseBook;
}

export interface ReadwiseBook {
  id: number;
  title?: string;
  author?: string;
  category?: string;
  source?: string;
  num_highlights?: number;
  updated?: string;
  cover_image_url?: string;
  highlights_url?: string;
  readwise_url?: string;
  source_url?: string;
  asin?: string;
  tags?: ReadwiseTag[];
  user_book_notes?: string;
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
  apiKey: string
): Promise<ReadwiseHighlight[]> {
  const allHighlights: ReadwiseHighlight[] = [];
  let nextCursor: string | null = null;

  do {
    const url: string = nextCursor
      ? `https://readwise.io/api/v2/export/?pageCursor=${nextCursor}`
      : `https://readwise.io/api/v2/export/`;

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
      
      // Process books and extract highlights with book metadata
      if (data.results) {
        data.results.forEach((book: ReadwiseBookExport) => {
          if (book.highlights && book.highlights.length > 0) {
            book.highlights.forEach((highlight: ReadwiseHighlightExport) => {
              allHighlights.push({
                ...highlight,
                book: {
                  id: book.user_book_id,
                  title: book.title,
                  author: book.author,
                  category: book.category,
                  cover_image_url: book.cover_image_url,
                  source_url: book.source_url,
                  readwise_url: book.readwise_url,
                },
              });
            });
          }
        });
      }
      
      nextCursor = data.nextPageCursor || null;
    } catch (error) {
      console.error("Error fetching Readwise highlights:", error);
      throw error;
    }
  } while (nextCursor);

  return allHighlights;
}

interface ReadwiseBookExport {
  user_book_id: number;
  title?: string;
  author?: string;
  category?: string;
  cover_image_url?: string;
  source_url?: string;
  readwise_url?: string;
  highlights?: ReadwiseHighlightExport[];
}

interface ReadwiseHighlightExport {
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
}

