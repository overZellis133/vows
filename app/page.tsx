"use client";

import { useState, useMemo } from "react";
import { philosopherQuotes, type Quote, getAllAuthors, getAllCategories } from "@/lib/quotes";
import { cn } from "@/lib/utils";
import { Loader2, Heart, BookOpen, FileText, Filter } from "lucide-react";

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
  const [filterAuthor, setFilterAuthor] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Filter quotes based on selected filters
  const filteredQuotes = useMemo(() => {
    let filtered = philosopherQuotes;
    
    if (filterAuthor !== "all") {
      filtered = filtered.filter(q => q.author === filterAuthor);
    }
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(q => q.category === filterCategory);
    }
    
    return filtered;
  }, [filterAuthor, filterCategory]);

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

              {/* Filters */}
              {selectedSource === "philosophers" && (
                <div className="mb-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Filter className="w-4 h-4" />
                    Filters
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Author Filter */}
                    <div>
                      <select
                        value={filterAuthor}
                        onChange={(e) => setFilterAuthor(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      >
                        <option value="all">All Authors</option>
                        {getAllAuthors().map(author => (
                          <option key={author} value={author}>{author}</option>
                        ))}
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      >
                        <option value="all">All Themes</option>
                        {getAllCategories().map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Results count */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? 's' : ''} found
                  </p>
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
                          ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20 shadow-md"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm"
                      )}
                    >
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {quote.author}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                        "{quote.text}"
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {quote.period}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Readwise Integration Coming Soon</p>
                    <p className="text-sm">
                      Connect your Readwise account to use your saved quotes as seeds for your vows
                    </p>
                    <button className="mt-4 px-6 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                      Learn More
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Quote Display */}
            {selectedQuote && (
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-2xl shadow-lg p-6 border border-rose-200 dark:border-rose-900">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">
                    Your Seed Quote
                  </h3>
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-medium italic mb-2">
                  "{selectedQuote.text}"
                </p>
                <p className="text-sm text-rose-900 dark:text-rose-300">
                  — {selectedQuote.author}
                </p>
              </div>
            )}
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
                      onClick={() => navigator.clipboard.writeText(vows)}
                      className="text-sm text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200"
                    >
                      Copy
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
