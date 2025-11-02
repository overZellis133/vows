export interface Quote {
  id: string;
  text: string;
  author: string;
  period: string;
  category?: string;
}

export const philosopherQuotes: Quote[] = [
  {
    id: "1",
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    period: "Ancient Greece (469-399 BCE)",
    category: "self-knowledge"
  },
  {
    id: "2",
    text: "Love is composed of a single soul inhabiting two bodies.",
    author: "Aristotle",
    period: "Ancient Greece (384-322 BCE)",
    category: "love"
  },
  {
    id: "3",
    text: "To love is to act.",
    author: "Victor Hugo",
    period: "France (1802-1885)",
    category: "love"
  },
  {
    id: "4",
    text: "We must love them both, those whose opinions we share and those whose opinions we reject. For both have labored in the search for truth, and both have helped us in finding it.",
    author: "Thomas Aquinas",
    period: "Medieval (1225-1274)",
    category: "love"
  },
  {
    id: "5",
    text: "The heart has its reasons which reason knows nothing of.",
    author: "Blaise Pascal",
    period: "France (1623-1662)",
    category: "love"
  },
  {
    id: "6",
    text: "Love is friendship that has caught fire.",
    author: "Ann Landers",
    period: "Modern (1918-2002)",
    category: "love"
  },
  {
    id: "7",
    text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
    author: "Lao Tzu",
    period: "Ancient China (6th century BCE)",
    category: "love"
  },
  {
    id: "8",
    text: "The best thing to hold onto in life is each other.",
    author: "Audrey Hepburn",
    period: "Modern (1929-1993)",
    category: "love"
  },
  {
    id: "9",
    text: "Love is an untamed force. When we try to control it, it destroys us. When we try to imprison it, it enslaves us. When we try to understand it, it leaves us feeling lost and confused.",
    author: "Paulo Coelho",
    period: "Modern (1947-present)",
    category: "love"
  },
  {
    id: "10",
    text: "We are all broken, that's how the light gets in.",
    author: "Ernest Hemingway",
    period: "Modern (1899-1961)",
    category: "growth"
  },
  {
    id: "11",
    text: "Hope is the thing with feathers that perches in the soul.",
    author: "Emily Dickinson",
    period: "Modern (1830-1886)",
    category: "hope"
  },
  {
    id: "12",
    text: "The art of being wise is the art of knowing what to overlook.",
    author: "William James",
    period: "Modern (1842-1910)",
    category: "wisdom"
  },
  {
    id: "13",
    text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson",
    period: "Modern (1803-1882)",
    category: "authenticity"
  },
  {
    id: "14",
    text: "In three words I can sum up everything I've learned about life: it goes on.",
    author: "Robert Frost",
    period: "Modern (1874-1963)",
    category: "life"
  },
  {
    id: "15",
    text: "Two souls, two thoughts, two unreconciled strivings; two warring ideals in one dark body.",
    author: "W.E.B. Du Bois",
    period: "Modern (1868-1963)",
    category: "identity"
  },
  {
    id: "16",
    text: "The courage to be is the courage to accept oneself, in spite of being unacceptable.",
    author: "Paul Tillich",
    period: "Modern (1886-1965)",
    category: "courage"
  },
  {
    id: "17",
    text: "Be patient toward all that is unsolved in your heart and try to love the questions themselves.",
    author: "Rainer Maria Rilke",
    period: "Modern (1875-1926)",
    category: "growth"
  },
  {
    id: "18",
    text: "We must be willing to let go of the life we have planned, so as to have the life that is waiting for us.",
    author: "Joseph Campbell",
    period: "Modern (1904-1987)",
    category: "change"
  },
  {
    id: "19",
    text: "Trust is the glue of life. It's the most essential ingredient in effective communication.",
    author: "Stephen Covey",
    period: "Modern (1932-2012)",
    category: "relationships"
  },
  {
    id: "20",
    text: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.",
    author: "Carl Jung",
    period: "Modern (1875-1961)",
    category: "relationships"
  }
];

export function getQuoteById(id: string): Quote | undefined {
  return philosopherQuotes.find(quote => quote.id === id);
}

export function getQuotesByCategory(category: string): Quote[] {
  return philosopherQuotes.filter(quote => quote.category === category);
}

export function getAllCategories(): string[] {
  const categories = new Set(philosopherQuotes.map(q => q.category).filter(Boolean));
  return Array.from(categories);
}

