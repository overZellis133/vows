"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { philosopherQuotes, type Quote, getAllAuthors, getAllCategories } from "@/lib/quotes";
import { cn } from "@/lib/utils";
import { Loader2, Heart, BookOpen, FileText, Filter, ChevronDown, ChevronUp, Search } from "lucide-react";
import type { ReadwiseHighlight } from "@/lib/readwise";

type QuoteSource = "philosophers" | "readwise";

export default function Home() {
  const [selectedSource, setSelectedSource] = useState<QuoteSource>("philosophers");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [vows, setVows] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personName, setPersonName] = useState("");
  const [relationship, setRelationship] = useState("spouse");
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
  const [readwiseApiKey, setReadwiseApiKey] = useState("");
  const [readwiseHighlights, setReadwiseHighlights] = useState<ReadwiseHighlight[]>([]);
  const [isLoadingReadwise, setIsLoadingReadwise] = useState(false);
  const [readwiseError, setReadwiseError] = useState<string | null>(null);
  const [readwiseFiltersCollapsed, setReadwiseFiltersCollapsed] = useState(false);
  const [readwiseQuoteSearch, setReadwiseQuoteSearch] = useState("");
  const [readwiseFilterAuthors, setReadwiseFilterAuthors] = useState<string[]>([]);
  const [readwiseFilterCategories, setReadwiseFilterCategories] = useState<string[]>([]);
  const [readwiseAuthorSearch, setReadwiseAuthorSearch] = useState("");
  const [readwiseCategorySearch, setReadwiseCategorySearch] = useState("");
  const [showReadwiseAuthors, setShowReadwiseAuthors] = useState(false);
  const [showReadwiseCategories, setShowReadwiseCategories] = useState(false);
  
  const authorDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const readwiseAuthorDropdownRef = useRef<HTMLDivElement>(null);
  const readwiseCategoryDropdownRef = useRef<HTMLDivElement>(null);

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
      if (highlight.document?.author) {
        authors.add(highlight.document.author);
      }
    });
    return Array.from(authors).sort();
  }, [readwiseHighlights]);

  const readwiseCategories = useMemo(() => {
    const categories = new Set<string>();
    readwiseHighlights.forEach(highlight => {
      if (highlight.document?.category) {
        categories.add(highlight.document.category);
      }
    });
    return Array.from(categories).sort();
  }, [readwiseHighlights]);

  // Filter Readwise authors and categories based on search
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

  // Filter Readwise highlights based on selected filters
  const filteredReadwiseHighlights = useMemo(() => {
    let filtered = readwiseHighlights;
    
    if (readwiseFilterAuthors.length > 0) {
      filtered = filtered.filter(h => 
        readwiseFilterAuthors.includes(h.document?.author || "")
      );
    }
    
    if (readwiseFilterCategories.length > 0) {
      filtered = filtered.filter(h => 
        readwiseFilterCategories.includes(h.document?.category || "")
      );
    }
    
    if (readwiseQuoteSearch.trim()) {
      filtered = filtered.filter(h => 
        h.text.toLowerCase().includes(readwiseQuoteSearch.toLowerCase()) ||
        (h.document?.author || "").toLowerCase().includes(readwiseQuoteSearch.toLowerCase()) ||
        (h.document?.title || "").toLowerCase().includes(readwiseQuoteSearch.toLowerCase())
      );
    }
    
    return filtered;
  }, [readwiseHighlights, readwiseFilterAuthors, readwiseFilterCategories, readwiseQuoteSearch]);

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
          personalContext,
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-950 dark:via-black dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-rose-500 fill-current" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Vows
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create heartfelt vows inspired by the wisdom of philosophers and thinkers throughout history
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Quote Selection */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-rose-500" />
                Choose Your Seed Quote
              </h2>

              {/* Source Tabs */}
              <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setSelectedSource("philosophers")}
                  className={cn(
                    "px-4 py-2 font-medium transition-colors border-b-2",
                    selectedSource === "philosophers"
                      ? "border-rose-500 text-rose-600"
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
                      ? "border-rose-500 text-rose-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  )}
                >
                  Readwise
                </button>
              </div>

              {/* Selected Quote Display */}
              {selectedQuote && (
                <div className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl shadow-lg p-4 border border-blue-200 dark:border-blue-900">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      Your Seed Quote
                    </h3>
                    <button
                      onClick={() => setSelectedQuote(null)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm italic mb-1">
                    &ldquo;{highlightText(selectedQuote.text, quoteSearch)}&rdquo;
                  </p>
                  <p className="text-xs text-blue-900 dark:text-blue-300">
                    &mdash; {highlightText(selectedQuote.author, quoteSearch)}
                  </p>
                </div>
              )}

              {/* Filters */}
              {selectedSource === "philosophers" && (
                <div className="mb-4 space-y-3">
                  <button
                    onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                    className="w-full flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
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
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm"
                      )}
                    >
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {highlightText(quote.author, quoteSearch)}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                        &ldquo;{highlightText(quote.text, quoteSearch)}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-500">
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
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Readwise Access Token
                          </label>
                          <input
                            type="password"
                            value={readwiseApiKey}
                            onChange={(e) => setReadwiseApiKey(e.target.value)}
                            placeholder="Paste your access token here..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                          />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
                          <button
                            onClick={() => setReadwiseFiltersCollapsed(!readwiseFiltersCollapsed)}
                            className="w-full flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                          >
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                            {readwiseFiltersCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                          </button>

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

                                {/* Category Filter */}
                                {readwiseCategories.length > 0 && (
                                  <div className="relative" ref={readwiseCategoryDropdownRef}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setShowReadwiseCategories(!showReadwiseCategories);
                                        setShowReadwiseAuthors(false);
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

                              {/* Results count */}
                              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                {filteredReadwiseHighlights.length} highlight{filteredReadwiseHighlights.length !== 1 ? 's' : ''} found
                              </p>
                            </>
                          )}
                        </div>

                        {/* Highlights List */}
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                          {filteredReadwiseHighlights.map((highlight) => (
                            <button
                              key={highlight.id}
                              onClick={() => {
                                setSelectedQuote({
                                  id: `readwise-${highlight.id}`,
                                  text: highlight.text,
                                  author: highlight.document?.author || highlight.document?.title || "Unknown",
                                  period: highlight.document?.category || "Readwise",
                                  category: undefined,
                                });
                              }}
                              className={cn(
                                "w-full text-left p-4 rounded-lg border-2 transition-all",
                                selectedQuote?.id === `readwise-${highlight.id}`
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md"
                                  : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm"
                              )}
                            >
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {highlightText(highlight.document?.author || "Unknown", readwiseQuoteSearch)}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                                &ldquo;{highlightText(highlight.text, readwiseQuoteSearch)}&rdquo;
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {highlight.document?.title && (
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {highlightText(highlight.document.title, readwiseQuoteSearch)}
                                  </p>
                                )}
                                {highlight.document?.category && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                    {highlight.document.category.charAt(0).toUpperCase() + highlight.document.category.slice(1)}
                                  </span>
                                )}
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

          {/* Right Column: Vow Generator */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-rose-500" />
                Create Your Vows
              </h2>

              {/* Relationship Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="spouse">Spouse</option>
                  <option value="partner">Partner</option>
                  <option value="friend">Friend</option>
                  <option value="family">Family Member</option>
                </select>
              </div>

              {/* Person Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name of your loved one
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="Enter their name..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Personal Context */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Personal Context <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={personalContext}
                  onChange={(e) => setPersonalContext(e.target.value)}
                  placeholder="Share details about what makes this person special, moments you've shared, qualities you admire, or what you hope for your future together..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none text-sm"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This helps create more personalized vows
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
                      : "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Vows"
                  )}
                </button>
                {(selectedQuote || vows) && (
                  <button
                    onClick={clearAll}
                    className="px-6 py-3 rounded-lg font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Vows Display */}
              {vows && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Your Vows
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
          <p>Created with ❤️ for crafting meaningful vows and personal letters</p>
        </footer>
      </div>
    </div>
  );
}
