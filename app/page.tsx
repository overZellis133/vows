"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { philosopherQuotes, type Quote, getAllAuthors, getAllCategories } from "@/lib/quotes";
import { cn } from "@/lib/utils";
import { Loader2, Heart, BookOpen, FileText, Filter, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import type { ReadwiseHighlight } from "@/lib/readwise";

type QuoteSource = "philosophers" | "readwise";
type ContentMode = "vows" | "eulogy";

type ToneOption = {
  value: string;
  label: string;
};

const VOW_TONE_OPTIONS: ToneOption[] = [
  { value: "warm", label: "Warm & Romantic" },
  { value: "formal", label: "Formal & Traditional" },
  { value: "playful", label: "Playful & Lighthearted" },
  { value: "poetic", label: "Poetic & Lyrical" },
  { value: "sincere", label: "Sincere & Heartfelt" },
  { value: "humorous", label: "Humorous & Witty" },
];

const EULOGY_TONE_OPTIONS: ToneOption[] = [
  { value: "sincere", label: "Sincere & Heartfelt" },
  { value: "formal", label: "Formal & Traditional" },
  { value: "poetic", label: "Poetic & Lyrical" },
  { value: "playful", label: "Playful & Lighthearted" },
  { value: "humorous", label: "Humorous & Witty" },
];

export default function Home() {
  const [selectedSource, setSelectedSource] = useState<QuoteSource>("philosophers");
  const [contentMode, setContentMode] = useState<ContentMode>("vows");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [vows, setVows] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personName, setPersonName] = useState("");
  const [relationship, setRelationship] = useState("partner");
  const [tone, setTone] = useState("warm");
  const [personalContext, setPersonalContext] = useState("");
  const [filterAuthors, setFilterAuthors] = useState<string[]>([]);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [authorSearch, setAuthorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [quoteSearch, setQuoteSearch] = useState("");
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [highlightGeneratorCard, setHighlightGeneratorCard] = useState(false);
  const [readwiseApiKey, setReadwiseApiKey] = useState("");
  const [readwiseHighlights, setReadwiseHighlights] = useState<ReadwiseHighlight[]>([]);
  const [isLoadingReadwise, setIsLoadingReadwise] = useState(false);
  const [readwiseError, setReadwiseError] = useState<string | null>(null);
  const [readwiseFiltersCollapsed, setReadwiseFiltersCollapsed] = useState(false);
  const [readwiseQuoteSearch, setReadwiseQuoteSearch] = useState("");
  const [readwiseFilterAuthors, setReadwiseFilterAuthors] = useState<string[]>([]);
  const [readwiseFilterCategories, setReadwiseFilterCategories] = useState<string[]>([]);
  const [readwiseFilterTitles, setReadwiseFilterTitles] = useState<string[]>([]);
  const [readwiseAuthorSearch, setReadwiseAuthorSearch] = useState("");
  const [readwiseCategorySearch, setReadwiseCategorySearch] = useState("");
  const [readwiseTitleSearch, setReadwiseTitleSearch] = useState("");
  const [showReadwiseAuthors, setShowReadwiseAuthors] = useState(false);
  const [showReadwiseCategories, setShowReadwiseCategories] = useState(false);
  const [showReadwiseTitles, setShowReadwiseTitles] = useState(false);
  const [readwiseDateStart, setReadwiseDateStart] = useState("");
  const [readwiseDateEnd, setReadwiseDateEnd] = useState("");
  
  const isEulogyMode = contentMode === "eulogy";
  const toneOptions = isEulogyMode ? EULOGY_TONE_OPTIONS : VOW_TONE_OPTIONS;

  const authorDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const quoteSectionRef = useRef<HTMLDivElement | null>(null);
  const generatorSectionRef = useRef<HTMLDivElement | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readwiseAuthorDropdownRef = useRef<HTMLDivElement>(null);
  const readwiseCategoryDropdownRef = useRef<HTMLDivElement>(null);
  const readwiseTitleDropdownRef = useRef<HTMLDivElement>(null);
  
  // Search input refs for autofocus
  const authorSearchRef = useRef<HTMLInputElement>(null);
  const categorySearchRef = useRef<HTMLInputElement>(null);
  const readwiseAuthorSearchRef = useRef<HTMLInputElement>(null);
  const readwiseCategorySearchRef = useRef<HTMLInputElement>(null);
  const readwiseTitleSearchRef = useRef<HTMLInputElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authorDropdownRef.current && !authorDropdownRef.current.contains(event.target as Node)) {
        setShowAllAuthors(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowAllCategories(false);
      }
      if (readwiseAuthorDropdownRef.current && !readwiseAuthorDropdownRef.current.contains(event.target as Node)) {
        setShowReadwiseAuthors(false);
      }
      if (readwiseCategoryDropdownRef.current && !readwiseCategoryDropdownRef.current.contains(event.target as Node)) {
        setShowReadwiseCategories(false);
      }
      if (readwiseTitleDropdownRef.current && !readwiseTitleDropdownRef.current.contains(event.target as Node)) {
        setShowReadwiseTitles(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Autofocus search inputs when dropdowns open
  useEffect(() => {
    if (showAllAuthors && authorSearchRef.current) {
      authorSearchRef.current.focus();
    }
  }, [showAllAuthors]);

  useEffect(() => {
    if (showAllCategories && categorySearchRef.current) {
      categorySearchRef.current.focus();
    }
  }, [showAllCategories]);

  useEffect(() => {
    if (showReadwiseAuthors && readwiseAuthorSearchRef.current) {
      readwiseAuthorSearchRef.current.focus();
    }
  }, [showReadwiseAuthors]);

  useEffect(() => {
    if (showReadwiseCategories && readwiseCategorySearchRef.current) {
      readwiseCategorySearchRef.current.focus();
    }
  }, [showReadwiseCategories]);

  useEffect(() => {
    if (showReadwiseTitles && readwiseTitleSearchRef.current) {
      readwiseTitleSearchRef.current.focus();
    }
  }, [showReadwiseTitles]);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const availableOptions = isEulogyMode ? EULOGY_TONE_OPTIONS : VOW_TONE_OPTIONS;
    if (!availableOptions.some(option => option.value === tone)) {
      setTone(availableOptions[0]?.value ?? "");
    }
  }, [isEulogyMode, tone]);

  // Filter authors and categories based on search
  const filteredAuthors = useMemo(() => {
    return getAllAuthors().filter(author => 
      author.toLowerCase().includes(authorSearch.toLowerCase())
    );
  }, [authorSearch]);

  const filteredCategories = useMemo(() => {
    return getAllCategories().filter(category => 
      category.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categorySearch]);

  // Filter quotes based on selected filters
  const filteredQuotes = useMemo(() => {
    let filtered = philosopherQuotes;
    
    if (filterAuthors.length > 0) {
      filtered = filtered.filter(q => filterAuthors.includes(q.author));
    }
    
    if (filterCategories.length > 0) {
      filtered = filtered.filter(q => filterCategories.includes(q.category || ""));
    }
    
    if (quoteSearch.trim()) {
      filtered = filtered.filter(q => 
        q.text.toLowerCase().includes(quoteSearch.toLowerCase()) ||
        q.author.toLowerCase().includes(quoteSearch.toLowerCase())
      );
    }
    
    return filtered;
  }, [filterAuthors, filterCategories, quoteSearch]);

  // Get unique authors and categories from Readwise highlights
  const readwiseAuthors = useMemo(() => {
    const authors = new Set<string>();
    readwiseHighlights.forEach(highlight => {
      if (highlight.book?.author) {
        authors.add(highlight.book.author);
      }
    });
    return Array.from(authors).sort();
  }, [readwiseHighlights]);

  const readwiseCategories = useMemo(() => {
    const categories = new Set<string>();
    readwiseHighlights.forEach(highlight => {
      if (highlight.book?.category) {
        categories.add(highlight.book.category);
      }
    });
    return Array.from(categories).sort();
  }, [readwiseHighlights]);

  const readwiseTitles = useMemo(() => {
    const titles = new Set<string>();
    readwiseHighlights.forEach(highlight => {
      if (highlight.book?.title) {
        titles.add(highlight.book.title);
      }
    });
    return Array.from(titles).sort();
  }, [readwiseHighlights]);

  // Filter Readwise authors, categories, and titles based on search
  const filteredReadwiseAuthors = useMemo(() => {
    return readwiseAuthors.filter(author => 
      author.toLowerCase().includes(readwiseAuthorSearch.toLowerCase())
    );
  }, [readwiseAuthors, readwiseAuthorSearch]);

  const filteredReadwiseCategories = useMemo(() => {
    return readwiseCategories.filter(category => 
      category.toLowerCase().includes(readwiseCategorySearch.toLowerCase())
    );
  }, [readwiseCategories, readwiseCategorySearch]);

  const filteredReadwiseTitles = useMemo(() => {
    return readwiseTitles.filter(title => 
      title.toLowerCase().includes(readwiseTitleSearch.toLowerCase())
    );
  }, [readwiseTitles, readwiseTitleSearch]);

  // Filter Readwise highlights based on selected filters
  const filteredReadwiseHighlights = useMemo(() => {
    let filtered = readwiseHighlights;
    
    if (readwiseFilterAuthors.length > 0) {
      filtered = filtered.filter(h => 
        readwiseFilterAuthors.includes(h.book?.author || "")
      );
    }
    
    if (readwiseFilterCategories.length > 0) {
      filtered = filtered.filter(h => 
        readwiseFilterCategories.includes(h.book?.category || "")
      );
    }

    if (readwiseFilterTitles.length > 0) {
      filtered = filtered.filter(h => 
        readwiseFilterTitles.includes(h.book?.title || "")
      );
    }

    if (readwiseDateStart) {
      filtered = filtered.filter(h => {
        if (!h.highlighted_at) return false;
        return new Date(h.highlighted_at) >= new Date(readwiseDateStart);
      });
    }

    if (readwiseDateEnd) {
      filtered = filtered.filter(h => {
        if (!h.highlighted_at) return false;
        return new Date(h.highlighted_at) <= new Date(readwiseDateEnd);
      });
    }
    
    if (readwiseQuoteSearch.trim()) {
      filtered = filtered.filter(h => 
        h.text.toLowerCase().includes(readwiseQuoteSearch.toLowerCase()) ||
        (h.book?.author || "").toLowerCase().includes(readwiseQuoteSearch.toLowerCase()) ||
        (h.book?.title || "").toLowerCase().includes(readwiseQuoteSearch.toLowerCase())
      );
    }
    
    return filtered;
  }, [readwiseHighlights, readwiseFilterAuthors, readwiseFilterCategories, readwiseFilterTitles, readwiseQuoteSearch, readwiseDateStart, readwiseDateEnd]);

  // Highlight search terms in text
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900/50 text-gray-900 dark:text-gray-100 rounded px-0.5">
          {part}
        </mark>
      ) : part
    );
  };

  const handleQuoteSelect = (quote: Quote) => {
    setSelectedQuote(quote);

    if (typeof window === "undefined") {
      return;
    }

    const isMobileViewport = window.innerWidth <= 768;
    const generatorEl = generatorSectionRef.current;

    if (!generatorEl || !isMobileViewport) {
      return;
    }

    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }

    setHighlightGeneratorCard(true);
    highlightTimerRef.current = setTimeout(() => {
      setHighlightGeneratorCard(false);
      highlightTimerRef.current = null;
    }, 1600);

    window.setTimeout(() => {
      generatorEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const generateVows = async () => {
    if (!selectedQuote) {
      setError("Please select a quote first");
      return;
    }

    if (!personName.trim()) {
      setError("Please enter the name of your loved one");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quote: selectedQuote,
          personName,
          relationship,
          tone,
          personalContext,
          mode: contentMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate vows");
      }

      const data = await response.json();
      setVows(data.vows);
    } catch (err) {
      setError("Failed to generate vows. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchReadwiseHighlights = async () => {
    if (!readwiseApiKey.trim()) {
      setReadwiseError("Please enter your Readwise API key");
      return;
    }

    setIsLoadingReadwise(true);
    setReadwiseError(null);

    try {
      const response = await fetch("/api/readwise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: readwiseApiKey }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Readwise highlights");
      }

      const data = await response.json();
      setReadwiseHighlights(data.highlights);
    } catch (err) {
      setReadwiseError("Failed to fetch Readwise highlights. Please check your API key.");
      console.error(err);
    } finally {
      setIsLoadingReadwise(false);
    }
  };

  const clearAll = () => {
    setSelectedQuote(null);
    setVows("");
    setPersonName("");
    setPersonalContext("");
    setError(null);
    setHighlightGeneratorCard(false);
    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      isEulogyMode 
        ? "bg-gradient-to-br from-gray-950 via-black to-gray-900" 
        : "bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-950 dark:via-black dark:to-gray-900"
    )}>
      <div className="container mx-auto px-4 py-6 sm:py-12 max-w-6xl">
        {/* Header */}
        <header className="mb-6 sm:mb-12 text-center">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setContentMode("vows")}
                className={cn(
                  "px-4 py-2 rounded-full font-medium transition-all text-sm",
                  !isEulogyMode
                    ? "bg-white dark:bg-gray-700 text-rose-600 dark:text-rose-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                Vows
              </button>
              <button
                onClick={() => setContentMode("eulogy")}
                className={cn(
                  "px-4 py-2 rounded-full font-medium transition-all text-sm",
                  isEulogyMode
                    ? "bg-gray-800 dark:bg-gray-700 text-blue-300 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                Eulogy
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 fill-current transition-colors",
              isEulogyMode ? "text-blue-400" : "text-rose-500"
            )} />
            <h1 className={cn(
              "text-3xl sm:text-5xl font-bold bg-clip-text text-transparent transition-colors",
              isEulogyMode
                ? "bg-gradient-to-r from-blue-300 to-blue-200 leading-[1.15]"
                : "bg-gradient-to-r from-rose-600 to-pink-600 leading-tight"
            )}>
              {isEulogyMode ? "Eulogy" : "Vows"}
          </h1>
          </div>
          <p className={cn(
            "text-base sm:text-xl max-w-2xl mx-auto transition-colors",
            isEulogyMode 
              ? "text-gray-200" 
              : "text-gray-600 dark:text-gray-400"
          )}>
            {isEulogyMode 
              ? "Create a meaningful eulogy inspired by the wisdom of philosophers and thinkers throughout history"
              : "Create heartfelt vows inspired by the wisdom of philosophers and thinkers throughout history"}
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8">
          {/* Left Column: Quote Selection */}
          <div className="space-y-6" ref={quoteSectionRef}>
            <div className={cn(
              "rounded-2xl shadow-lg p-4 sm:p-6 border transition-colors",
              isEulogyMode
                ? "bg-gray-900 border-gray-800"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            )}>
              <h2 className={cn(
                "text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2 transition-colors",
                isEulogyMode ? "text-gray-100" : "text-gray-900 dark:text-gray-100"
              )}>
                <BookOpen className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                  isEulogyMode ? "text-blue-400" : "text-rose-500"
                )} />
                Choose Your Seed Quote
              </h2>

              {/* Source Tabs */}
              <div className={cn(
                "flex gap-2 mb-6 border-b transition-colors",
                isEulogyMode ? "border-gray-700" : "border-gray-200 dark:border-gray-800"
              )}>
                <button
                  onClick={() => setSelectedSource("philosophers")}
                  className={cn(
                    "px-4 py-2 font-medium transition-colors border-b-2",
                    selectedSource === "philosophers"
                      ? isEulogyMode
                        ? "border-blue-400 text-blue-300"
                        : "border-rose-500 text-rose-600"
                      : isEulogyMode
                        ? "border-transparent text-gray-400 hover:text-gray-200"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  )}
                >
                  Philosophers
                </button>
                <button
                  onClick={() => setSelectedSource("readwise")}
                  className={cn(
                    "px-4 py-2 font-medium transition-colors border-b-2",
                    selectedSource === "readwise"
                      ? isEulogyMode
                        ? "border-blue-400 text-blue-300"
                        : "border-rose-500 text-rose-600"
                      : isEulogyMode
                        ? "border-transparent text-gray-400 hover:text-gray-200"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  )}
                >
                  Readwise
                </button>
              </div>

              {/* Selected Quote Display */}
              {selectedQuote && (
                <div className={cn(
                  "mb-4 rounded-2xl shadow-lg p-4 border transition-colors",
                  isEulogyMode
                    ? "bg-gradient-to-br from-blue-950/40 to-indigo-950/40 border-blue-800"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-900"
                )}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={cn(
                      "text-sm font-semibold transition-colors",
                      isEulogyMode ? "text-blue-200" : "text-blue-900 dark:text-blue-100"
                    )}>
                      Your Seed Quote
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedQuote(null);
                        setHighlightGeneratorCard(false);
                        if (highlightTimerRef.current) {
                          clearTimeout(highlightTimerRef.current);
                          highlightTimerRef.current = null;
                        }
                      }}
                      className={cn(
                        "text-sm transition-colors",
                        isEulogyMode
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      )}
                    >
                      ✕
                    </button>
                  </div>
                  <p className={cn(
                    "text-sm italic mb-1 transition-colors",
                    isEulogyMode ? "text-gray-200" : "text-gray-700 dark:text-gray-300"
                  )}>
                    &ldquo;{highlightText(selectedQuote.text, quoteSearch)}&rdquo;
                  </p>
                  <p className={cn(
                    "text-xs transition-colors",
                    isEulogyMode ? "text-blue-300" : "text-blue-900 dark:text-blue-300"
                  )}>
                    &mdash; {highlightText(selectedQuote.author, quoteSearch)}
                  </p>
                </div>
              )}

              {/* Filters */}
              {selectedSource === "philosophers" && (
                <div className="mb-4 space-y-3">
                  <button
                    onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                    className={cn(
                      "w-full flex items-center gap-2 text-sm font-medium transition-colors",
                      isEulogyMode 
                        ? "text-gray-200 hover:text-gray-100" 
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                    {filtersCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>

                  {!filtersCollapsed && (
                    <>
                      {/* Quote Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={quoteSearch}
                          onChange={(e) => setQuoteSearch(e.target.value)}
                          placeholder="Search quotes..."
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        {/* Philosopher Filter */}
                        <div className="relative" ref={authorDropdownRef}>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAllAuthors(!showAllAuthors);
                              setShowAllCategories(false);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-pointer flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-600 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              {filterAuthors.length === 0 ? (
                                <span className="text-gray-500 dark:text-gray-400">Select philosophers...</span>
                              ) : (
                                filterAuthors.map(author => (
                                  <span key={author} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded-full">
                                    {author}
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFilterAuthors(filterAuthors.filter(a => a !== author));
                                      }}
                                      className="hover:text-rose-600 dark:hover:text-rose-300 cursor-pointer"
                                    >
                                      ×
                                    </span>
                                  </span>
                                ))
                              )}
                            </div>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", showAllAuthors && "rotate-180")} />
                          </button>
                          {showAllAuthors && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                <input
                                  ref={authorSearchRef}
                                  type="text"
                                  value={authorSearch}
                                  onChange={(e) => setAuthorSearch(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Search..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                />
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                {(authorSearch ? filteredAuthors : getAllAuthors()).map(author => (
                                  <button
                                    key={author}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (filterAuthors.includes(author)) {
                                        setFilterAuthors(filterAuthors.filter(a => a !== author));
                                      } else {
                                        setFilterAuthors([...filterAuthors, author]);
                                      }
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 text-sm hover:bg-rose-50 dark:hover:bg-gray-700 flex items-center gap-2",
                                      filterAuthors.includes(author) && "bg-rose-50 dark:bg-gray-700"
                                    )}
                                  >
                                    <span className={cn("w-3 h-3 border rounded flex items-center justify-center", filterAuthors.includes(author) ? "bg-rose-500 border-rose-500" : "border-gray-300")}>
                                      {filterAuthors.includes(author) && <span className="text-white text-xs">✓</span>}
                                    </span>
                                    {author}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
        </div>

                        {/* Theme Filter */}
                        <div className="relative" ref={categoryDropdownRef}>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAllCategories(!showAllCategories);
                              setShowAllAuthors(false);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-pointer flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-600 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              {filterCategories.length === 0 ? (
                                <span className="text-gray-500 dark:text-gray-400">Select themes...</span>
                              ) : (
                                filterCategories.map(category => (
                                  <span key={category} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFilterCategories(filterCategories.filter(c => c !== category));
                                      }}
                                      className="hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer"
                                    >
                                      ×
                                    </span>
                                  </span>
                                ))
                              )}
                            </div>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", showAllCategories && "rotate-180")} />
                          </button>
                          {showAllCategories && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                <input
                                  ref={categorySearchRef}
                                  type="text"
                                  value={categorySearch}
                                  onChange={(e) => setCategorySearch(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Search..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                />
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                {(categorySearch ? filteredCategories : getAllCategories()).map(category => (
                                  <button
                                    key={category}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (filterCategories.includes(category)) {
                                        setFilterCategories(filterCategories.filter(c => c !== category));
                                      } else {
                                        setFilterCategories([...filterCategories, category]);
                                      }
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-2",
                                      filterCategories.includes(category) && "bg-blue-50 dark:bg-gray-700"
                                    )}
                                  >
                                    <span className={cn("w-3 h-3 border rounded flex items-center justify-center", filterCategories.includes(category) ? "bg-blue-500 border-blue-500" : "border-gray-300")}>
                                      {filterCategories.includes(category) && <span className="text-white text-xs">✓</span>}
                                    </span>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Results count */}
                      <p className={cn(
                        "text-xs text-center transition-colors",
                        isEulogyMode ? "text-gray-300" : "text-gray-500 dark:text-gray-400"
                      )}>
                        {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? 's' : ''} found
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Quote List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {selectedSource === "philosophers" ? (
                  filteredQuotes.map((quote) => (
                    <button
                      key={quote.id}
                      onClick={() => handleQuoteSelect(quote)}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border-2 transition-all",
                        selectedQuote?.id === quote.id
                          ? isEulogyMode
                            ? "border-blue-400 bg-blue-900/40 shadow-md"
                            : "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md"
                          : isEulogyMode
                            ? "border-gray-800 hover:border-gray-700 hover:shadow-sm bg-gray-900/50"
                            : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm"
                      )}
                    >
                      <p className={cn(
                        "text-sm font-medium mb-1 transition-colors",
                        isEulogyMode 
                          ? selectedQuote?.id === quote.id ? "text-gray-100" : "text-gray-200"
                          : "text-gray-700 dark:text-gray-300"
                      )}>
                        {highlightText(quote.author, quoteSearch)}
                      </p>
                      <p className={cn(
                        "text-sm italic transition-colors",
                        isEulogyMode 
                          ? selectedQuote?.id === quote.id ? "text-gray-200" : "text-gray-300"
                          : "text-gray-600 dark:text-gray-400"
                      )}>
                        &ldquo;{highlightText(quote.text, quoteSearch)}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className={cn(
                          "text-xs transition-colors",
                          isEulogyMode ? "text-gray-300" : "text-gray-500 dark:text-gray-500"
                        )}>
                          {quote.period}
                        </p>
                        {quote.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="space-y-4">
                    {readwiseHighlights.length === 0 && (
                      <>
                        <div className="text-center py-4">
                          <p className={cn(
                            "text-sm mb-4 transition-colors",
                            isEulogyMode ? "text-gray-200" : "text-gray-600 dark:text-gray-400"
                          )}>
                            Connect your Readwise account to use your saved highlights
                          </p>
                          <a
                            href="https://readwise.io/access_token"
            target="_blank"
            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium hover:from-rose-600 hover:to-pink-600 transition-all"
                          >
                            Get Readwise Access Token
                          </a>
                        </div>
                        <div>
                          <label className={cn(
                            "block text-sm font-medium mb-2 transition-colors",
                            isEulogyMode ? "text-gray-200" : "text-gray-700 dark:text-gray-300"
                          )}>
                            Readwise Access Token
                          </label>
                          <input
                            type="password"
                            value={readwiseApiKey}
                            onChange={(e) => setReadwiseApiKey(e.target.value)}
                            placeholder="Paste your access token here..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                          />
                          <p className={cn(
                            "mt-1 text-xs transition-colors",
                            isEulogyMode ? "text-gray-300" : "text-gray-500 dark:text-gray-400"
                          )}>
                            Your token stays in your browser and is never sent to our servers
                          </p>
                        </div>
                        <button
                          onClick={fetchReadwiseHighlights}
                          disabled={isLoadingReadwise || !readwiseApiKey.trim()}
                          className={cn(
                            "w-full px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                            isLoadingReadwise || !readwiseApiKey.trim()
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                              : "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
                          )}
                        >
                          {isLoadingReadwise ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            "Load My Highlights"
                          )}
                        </button>
                      </>
                    )}
                    {readwiseError && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-red-700 dark:text-red-400 text-sm">
                        {readwiseError}
                      </div>
                    )}
                    {readwiseHighlights.length > 0 && (
                      <>
                        {/* Readwise Filters */}
                        <div className="mb-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setReadwiseFiltersCollapsed(!readwiseFiltersCollapsed)}
                              className={cn(
                                "flex items-center gap-2 text-sm font-medium transition-colors",
                                isEulogyMode 
                                  ? "text-gray-200 hover:text-gray-100" 
                                  : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                              )}
                            >
                              <Filter className="w-4 h-4" />
                              <span>Filters</span>
                              {readwiseFiltersCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setReadwiseFiltersCollapsed(!readwiseFiltersCollapsed)}
                              className={cn(
                                "text-xs transition-colors",
                                isEulogyMode 
                                  ? "text-gray-300 hover:text-gray-200"
                                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                              )}
                            >
                              {filteredReadwiseHighlights.length} highlight{filteredReadwiseHighlights.length !== 1 ? 's' : ''} found
                            </button>
                          </div>

                          {!readwiseFiltersCollapsed && (
                            <>
                              {/* Quote Search */}
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  value={readwiseQuoteSearch}
                                  onChange={(e) => setReadwiseQuoteSearch(e.target.value)}
                                  placeholder="Search highlights..."
                                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                              </div>
                              
                              <div className="space-y-3">
                                {/* Author Filter */}
                                {readwiseAuthors.length > 0 && (
                                  <div className="relative" ref={readwiseAuthorDropdownRef}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setShowReadwiseAuthors(!showReadwiseAuthors);
                                        setShowReadwiseCategories(false);
                                      }}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-pointer flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-600 transition-colors text-left"
                                    >
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {readwiseFilterAuthors.length === 0 ? (
                                          <span className="text-gray-500 dark:text-gray-400">Select authors...</span>
                                        ) : (
                                          readwiseFilterAuthors.map(author => (
                                            <span key={author} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded-full">
                                              {author}
                                              <span
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setReadwiseFilterAuthors(readwiseFilterAuthors.filter(a => a !== author));
                                                }}
                                                className="hover:text-rose-600 dark:hover:text-rose-300 cursor-pointer"
                                              >
                                                ×
                                              </span>
                                            </span>
                                          ))
                                        )}
                                      </div>
                                      <ChevronDown className={cn("w-4 h-4 transition-transform", showReadwiseAuthors && "rotate-180")} />
                                    </button>
                                    {showReadwiseAuthors && (
                                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                          <input
                                            ref={readwiseAuthorSearchRef}
                                            type="text"
                                            value={readwiseAuthorSearch}
                                            onChange={(e) => setReadwiseAuthorSearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Search..."
                                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                          />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                          {(readwiseAuthorSearch ? filteredReadwiseAuthors : readwiseAuthors).map(author => (
                                            <button
                                              key={author}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (readwiseFilterAuthors.includes(author)) {
                                                  setReadwiseFilterAuthors(readwiseFilterAuthors.filter(a => a !== author));
                                                } else {
                                                  setReadwiseFilterAuthors([...readwiseFilterAuthors, author]);
                                                }
                                              }}
                                              className={cn(
                                                "w-full text-left px-3 py-2 text-sm hover:bg-rose-50 dark:hover:bg-gray-700 flex items-center gap-2",
                                                readwiseFilterAuthors.includes(author) && "bg-rose-50 dark:bg-gray-700"
                                              )}
                                            >
                                              <span className={cn("w-3 h-3 border rounded flex items-center justify-center", readwiseFilterAuthors.includes(author) ? "bg-rose-500 border-rose-500" : "border-gray-300")}>
                                                {readwiseFilterAuthors.includes(author) && <span className="text-white text-xs">✓</span>}
                                              </span>
                                              {author}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Title Filter */}
                                {readwiseTitles.length > 0 && (
                                  <div className="relative" ref={readwiseTitleDropdownRef}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setShowReadwiseTitles(!showReadwiseTitles);
                                        setShowReadwiseAuthors(false);
                                        setShowReadwiseCategories(false);
                                      }}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-pointer flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-600 transition-colors text-left"
                                    >
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {readwiseFilterTitles.length === 0 ? (
                                          <span className="text-gray-500 dark:text-gray-400">Select titles...</span>
                                        ) : (
                                          readwiseFilterTitles.map(title => (
                                            <span key={title} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                                              {title}
                                              <span
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setReadwiseFilterTitles(readwiseFilterTitles.filter(t => t !== title));
                                                }}
                                                className="hover:text-purple-600 dark:hover:text-purple-300 cursor-pointer"
                                              >
                                                ×
                                              </span>
                                            </span>
                                          ))
                                        )}
                                      </div>
                                      <ChevronDown className={cn("w-4 h-4 transition-transform", showReadwiseTitles && "rotate-180")} />
                                    </button>
                                    {showReadwiseTitles && (
                                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                          <input
                                            ref={readwiseTitleSearchRef}
                                            type="text"
                                            value={readwiseTitleSearch}
                                            onChange={(e) => setReadwiseTitleSearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Search..."
                                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                          />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                          {(readwiseTitleSearch ? filteredReadwiseTitles : readwiseTitles).map(title => (
                                            <button
                                              key={title}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (readwiseFilterTitles.includes(title)) {
                                                  setReadwiseFilterTitles(readwiseFilterTitles.filter(t => t !== title));
                                                } else {
                                                  setReadwiseFilterTitles([...readwiseFilterTitles, title]);
                                                }
                                              }}
                                              className={cn(
                                                "w-full text-left px-3 py-2 text-sm hover:bg-purple-50 dark:hover:bg-gray-700 flex items-center gap-2",
                                                readwiseFilterTitles.includes(title) && "bg-purple-50 dark:bg-gray-700"
                                              )}
                                            >
                                              <span className={cn("w-3 h-3 border rounded flex items-center justify-center", readwiseFilterTitles.includes(title) ? "bg-purple-500 border-purple-500" : "border-gray-300")}>
                                                {readwiseFilterTitles.includes(title) && <span className="text-white text-xs">✓</span>}
                                              </span>
                                              {title}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Category Filter */}
                                {readwiseCategories.length > 0 && (
                                  <div className="relative" ref={readwiseCategoryDropdownRef}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setShowReadwiseCategories(!showReadwiseCategories);
                                        setShowReadwiseAuthors(false);
                                        setShowReadwiseTitles(false);
                                      }}
                                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 cursor-pointer flex items-center justify-between hover:border-gray-400 dark:hover:border-gray-600 transition-colors text-left"
                                    >
                                      <div className="flex items-center gap-2 flex-wrap">
                                        {readwiseFilterCategories.length === 0 ? (
                                          <span className="text-gray-500 dark:text-gray-400">Select categories...</span>
                                        ) : (
                                          readwiseFilterCategories.map(category => (
                                            <span key={category} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                              {category.charAt(0).toUpperCase() + category.slice(1)}
                                              <span
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setReadwiseFilterCategories(readwiseFilterCategories.filter(c => c !== category));
                                                }}
                                                className="hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer"
                                              >
                                                ×
                                              </span>
                                            </span>
                                          ))
                                        )}
                                      </div>
                                      <ChevronDown className={cn("w-4 h-4 transition-transform", showReadwiseCategories && "rotate-180")} />
                                    </button>
                                    {showReadwiseCategories && (
                                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                          <input
                                            ref={readwiseCategorySearchRef}
                                            type="text"
                                            value={readwiseCategorySearch}
                                            onChange={(e) => setReadwiseCategorySearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Search..."
                                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                          />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                          {(readwiseCategorySearch ? filteredReadwiseCategories : readwiseCategories).map(category => (
                                            <button
                                              key={category}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (readwiseFilterCategories.includes(category)) {
                                                  setReadwiseFilterCategories(readwiseFilterCategories.filter(c => c !== category));
                                                } else {
                                                  setReadwiseFilterCategories([...readwiseFilterCategories, category]);
                                                }
                                              }}
                                              className={cn(
                                                "w-full text-left px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-2",
                                                readwiseFilterCategories.includes(category) && "bg-blue-50 dark:bg-gray-700"
                                              )}
                                            >
                                              <span className={cn("w-3 h-3 border rounded flex items-center justify-center", readwiseFilterCategories.includes(category) ? "bg-blue-500 border-blue-500" : "border-gray-300")}>
                                                {readwiseFilterCategories.includes(category) && <span className="text-white text-xs">✓</span>}
                                              </span>
                                              {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Date Range Filter */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className={cn(
                                    "block text-xs mb-1 transition-colors",
                                    isEulogyMode ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                                  )}>
                                    From date
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="date"
                                      value={readwiseDateStart}
                                      onChange={(e) => setReadwiseDateStart(e.target.value)}
                                      className={cn(
                                        "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent",
                                        readwiseDateStart && "pr-8"
                                      )}
                                    />
                                    {readwiseDateStart && (
                                      <button
                                        onClick={() => setReadwiseDateStart("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                                      >
                                        <X className="w-3 h-3 text-red-500" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className={cn(
                                    "block text-xs mb-1 transition-colors",
                                    isEulogyMode ? "text-gray-300" : "text-gray-600 dark:text-gray-400"
                                  )}>
                                    To date
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="date"
                                      value={readwiseDateEnd}
                                      onChange={(e) => setReadwiseDateEnd(e.target.value)}
                                      className={cn(
                                        "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent",
                                        readwiseDateEnd && "pr-8"
                                      )}
                                    />
                                    {readwiseDateEnd && (
                                      <button
                                        onClick={() => setReadwiseDateEnd("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                                      >
                                        <X className="w-3 h-3 text-red-500" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Highlights List */}
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                          {filteredReadwiseHighlights.map((highlight) => (
                            <button
                              key={highlight.id}
                              onClick={() => {
                                handleQuoteSelect({
                                  id: `readwise-${highlight.id}`,
                                  text: highlight.text,
                                  author: highlight.book?.author || highlight.book?.title || "Unknown",
                                  period: highlight.book?.category || "Readwise",
                                  category: undefined,
                                });
                              }}
                              className={cn(
                                "w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all",
                                selectedQuote?.id === `readwise-${highlight.id}`
                                  ? isEulogyMode
                                    ? "border-blue-400 bg-blue-900/40 shadow-md"
                                    : "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md"
                                  : isEulogyMode
                                    ? "border-gray-800 hover:border-gray-700 hover:shadow-sm bg-gray-900/50"
                                    : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm"
                              )}
                            >
                            <div className="flex gap-2 sm:gap-3">
                              {/* Book Image */}
                              {highlight.book?.cover_image_url && (
                                <div className="flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={highlight.book.cover_image_url}
                                    alt={highlight.book.title || "Book cover"}
                                    className="max-h-24 sm:max-h-32 w-auto rounded border border-gray-200 dark:border-gray-700"
                                    onError={(e) => {
                                      // Hide image if it fails to load
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                {/* Author and Title */}
                                <p className={cn(
                                  "text-sm font-medium mb-1 transition-colors",
                                  isEulogyMode 
                                    ? selectedQuote?.id === `readwise-${highlight.id}` ? "text-gray-100" : "text-gray-200"
                                    : "text-gray-700 dark:text-gray-300"
                                )}>
                                  {highlight.book?.author ? highlightText(highlight.book.author, readwiseQuoteSearch) : 
                                   highlight.book?.title ? highlightText(highlight.book.title, readwiseQuoteSearch) : 
                                   "Unknown"}
                                </p>
                                
                                {/* Quote Text */}
                                <p className={cn(
                                  "text-sm italic mb-2 transition-colors",
                                  isEulogyMode 
                                    ? selectedQuote?.id === `readwise-${highlight.id}` ? "text-gray-200" : "text-gray-300"
                                    : "text-gray-600 dark:text-gray-400"
                                )}>
                                  &ldquo;{highlightText(highlight.text, readwiseQuoteSearch)}&rdquo;
                                </p>
                                
                                {/* Metadata Row */}
                                <div className={cn(
                                  "flex items-center gap-2 flex-wrap text-xs transition-colors",
                                  isEulogyMode ? "text-gray-300" : "text-gray-500 dark:text-gray-500"
                                )}>
                                  {highlight.book?.title && highlight.book?.author && (
                                    <span className="inline-flex items-center gap-1">
                                      <BookOpen className="w-3 h-3" />
                                      {highlightText(highlight.book.title, readwiseQuoteSearch)}
                                    </span>
                                  )}
                                  {highlight.book?.category && (
                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                      {highlight.book.category.charAt(0).toUpperCase() + highlight.book.category.slice(1)}
                                    </span>
                                  )}
                                  {highlight.highlighted_at && (
                                    <span className="inline-flex items-center gap-1">
                                      📅 {new Date(highlight.highlighted_at).toLocaleDateString()}
                                    </span>
                                  )}
                                  {highlight.url && (
                                    <a
                                      href={highlight.url}
            target="_blank"
            rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      🔗 View highlight
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Content Generator */}
          <div className="space-y-6">
            <div
              ref={generatorSectionRef}
              className={cn(
                "rounded-2xl shadow-lg p-4 sm:p-6 border transition-colors",
                isEulogyMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
                highlightGeneratorCard && (isEulogyMode ? "ring-2 ring-blue-400" : "ring-2 ring-rose-400")
              )}
            >
              <h2 className={cn(
                "text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2 transition-colors",
                isEulogyMode ? "text-gray-100" : "text-gray-900 dark:text-gray-100"
              )}>
                <FileText className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                  isEulogyMode ? "text-blue-400" : "text-rose-500"
                )} />
                {isEulogyMode ? "Create Your Eulogy" : "Create Your Vows"}
              </h2>

              {selectedQuote && (
                <div
                  className={cn(
                    "sm:hidden mb-4 p-4 rounded-xl border transition-colors",
                    isEulogyMode
                      ? "bg-blue-950/40 border-blue-800 text-gray-100"
                      : "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-700 dark:text-blue-100"
                  )}
                >
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                        Your seed quote
                      </p>
                      <p className="text-sm italic leading-relaxed">
                        &ldquo;{selectedQuote.text}&rdquo;
                      </p>
                      <p className="text-xs opacity-80">— {selectedQuote.author}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHighlightGeneratorCard(false);
                        if (highlightTimerRef.current) {
                          clearTimeout(highlightTimerRef.current);
                          highlightTimerRef.current = null;
                        }
                        if (quoteSectionRef.current) {
                          quoteSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors",
                        isEulogyMode
                          ? "bg-blue-800 hover:bg-blue-700 text-gray-100"
                          : "bg-blue-600 hover:bg-blue-500 text-white"
                      )}
                    >
                      <ChevronUp className="w-3 h-3" />
                      Change quote
                    </button>
                  </div>
                </div>
              )}

              {/* Relationship Type */}
              <div className="mb-4">
                <label className={cn(
                  "block text-sm font-medium mb-2 transition-colors",
                  isEulogyMode ? "text-gray-100" : "text-gray-700 dark:text-gray-300"
                )}>
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:border-transparent",
                    isEulogyMode ? "focus:ring-blue-500" : "focus:ring-rose-500"
                  )}
                >
                  <option value="partner">Partner</option>
                  <option value="spouse">Spouse</option>
                  <option value="friend">Friend</option>
                  <option value="family">Family Member</option>
                </select>
              </div>

              {/* Person Name */}
              <div className="mb-4">
                <label className={cn(
                  "block text-sm font-medium mb-2 transition-colors",
                  isEulogyMode ? "text-gray-100" : "text-gray-700 dark:text-gray-300"
                )}>
                  Name of your loved one
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="Enter their name..."
                  className={cn(
                    "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:border-transparent",
                    isEulogyMode ? "focus:ring-blue-500" : "focus:ring-rose-500"
                  )}
                />
              </div>

              {/* Tone Selection */}
              <div className="mb-4">
                <label className={cn(
                  "block text-sm font-medium mb-2 transition-colors",
                  isEulogyMode ? "text-gray-100" : "text-gray-700 dark:text-gray-300"
                )}>
                  Tone
                </label>
                <select
                  value={toneOptions.some(option => option.value === tone) ? tone : toneOptions[0]?.value ?? ""}
                  onChange={(e) => setTone(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:border-transparent",
                    isEulogyMode ? "focus:ring-blue-500" : "focus:ring-rose-500"
                  )}
                >
                  {toneOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal Context */}
              <div className="mb-6">
                <label className={cn(
                  "block text-sm font-medium mb-2 transition-colors",
                  isEulogyMode ? "text-gray-100" : "text-gray-700 dark:text-gray-300"
                )}>
                  Personal Context <span className={cn(
                    "font-normal transition-colors",
                    isEulogyMode ? "text-gray-400" : "text-gray-500"
                  )}>(Optional)</span>
                </label>
                <textarea
                  value={personalContext}
                  onChange={(e) => setPersonalContext(e.target.value)}
                  placeholder={isEulogyMode
                    ? "Share memories, qualities, and stories that celebrate their life, the impact they had, and moments you cherish..."
                    : "Share details about what makes this person special, moments you've shared, qualities you admire, or what you hope for your future together..."
                  }
                  rows={4}
                  className={cn(
                    "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:border-transparent resize-none text-sm",
                    isEulogyMode ? "focus:ring-blue-500" : "focus:ring-rose-500"
                  )}
                />
                <p className={cn(
                  "mt-1 text-xs transition-colors",
                  isEulogyMode ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
                )}>
                  {isEulogyMode 
                    ? "This helps create a more personalized eulogy"
                    : "This helps create more personalized vows"}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={generateVows}
                  disabled={isGenerating || !selectedQuote || !personName.trim()}
                  className={cn(
                    "flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                    isGenerating || !selectedQuote || !personName.trim()
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                      : isEulogyMode
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        : "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    contentMode === "vows" ? "Generate Vows" : "Generate Eulogy"
                  )}
                </button>
                {(selectedQuote || vows) && (
                  <button
                    onClick={clearAll}
                    className={cn(
                      "px-6 py-3 rounded-lg font-medium border transition-colors",
                      isEulogyMode
                        ? "border-gray-600 text-gray-200 hover:bg-gray-800 hover:border-gray-500"
                        : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Content Display */}
              {vows && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={cn(
                      "text-lg font-semibold transition-colors",
                      isEulogyMode ? "text-gray-100" : "text-gray-900 dark:text-gray-100"
                    )}>
                      {isEulogyMode ? "Your Eulogy" : "Your Vows"}
                    </h3>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(vows);
                        setCopied(true);
                      }}
                      className={cn(
                        "text-sm font-medium transition-colors",
                        copied
                          ? "text-green-600 dark:text-green-400"
                          : "text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200"
                      )}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    value={vows}
                    onChange={(e) => setVows(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent min-h-[400px] resize-none"
                    placeholder="Your generated vows will appear here..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 dark:text-gray-400 text-sm mt-12">
          <p>Created with ❤️ to help you craft meaningful vows and heartfelt eulogies</p>
        </footer>
      </div>
    </div>
  );
}
