import { useState, useEffect } from "react";
import Papa from "papaparse";
import RecipeCard from "./RecipeCard";

// Path to assets
const CSV_FILE_PATH = "/src/assets/recipes_with_descriptions.csv";
const IMAGE_PATH = "/src/assets/"; // Ensure images are stored here

const ITEMS_PER_PAGE = 9; // Show 9 recipes per page
const API_URL = "http://localhost:8000/recipes"; // FastAPI endpoint

const Recipes = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]); // Stores all recipes from CSV
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Stores search results
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Track if searching via API

  // Fetch and parse CSV file on mount
  useEffect(() => {
    fetch(CSV_FILE_PATH)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const formattedRecipes = result.data.map((recipe) => ({
              title: recipe.Title,
              image: `${IMAGE_PATH}${recipe.Image_Name}.jpg`, // Ensure .jpg extension
              score: null, // Default score for non-searched items
            }));
            setRecipes(formattedRecipes);
            setFilteredRecipes(formattedRecipes); // Default to all recipes
          },
        });
      });
  }, []);

  // Function to submit query to FastAPI and fetch similar recipes
  const fetchSimilarRecipes = async () => {
    if (!query.trim()) return; // Prevent empty search

    setLoading(true);
    setIsSearching(true); // Set searching mode
    try {
      const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      // Sort by score (highest first)
      const sortedResults = data
        .map((recipe) => ({
          title: recipe.title,
          image: `${IMAGE_PATH}${recipe.image_name}.jpg`, // Ensure correct image path
          score: recipe.score,
        }))
        .sort((a, b) => b.score - a.score); // Ensure descending order by score

      setFilteredRecipes(sortedResults);
      setCurrentPage(1); // Reset pagination
    } catch (error) {
      console.error("Error fetching similar recipes:", error);
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset search and show all recipes
  const handleClear = () => {
    setQuery("");
    setFilteredRecipes(recipes);
    setIsSearching(false);
  };

  // Separate top 3 recipes
  const topThreeRecipes = isSearching ? filteredRecipes.slice(0, 3) : [];
  const remainingRecipes = isSearching ? filteredRecipes.slice(3) : filteredRecipes;

  // Pagination logic for remaining recipes
  const totalPages = Math.ceil(remainingRecipes.length / ITEMS_PER_PAGE);
  const paginatedRecipes = remainingRecipes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🍽️ Recipe Explorer</h1>

      {/* Search Bar with Submit Button */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search recipes..."
          className="p-3 border rounded-lg w-2/3 md:w-1/2 focus:ring-2 focus:ring-blue-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="ml-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={fetchSimilarRecipes}
        >
          Search
        </button>
        <button
          className="ml-3 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-500">Loading recipes...</p>}

      {/* Highlight Top 3 Recipes */}
      {isSearching && topThreeRecipes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-center text-red-600">🔥 Top 3 Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {topThreeRecipes.map((recipe, index) => (
              <div key={index} className="relative border-4 border-red-500 p-2 rounded-lg shadow-lg">
                <RecipeCard title={recipe.title} image={recipe.image} />
                {/* Top 3 display "Recommended" instead of score */}
                <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg text-lg border-2 border-white">
                  ⭐ Recommended
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Grid (3 Columns per Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedRecipes.length === 0 && !loading ? (
          <p className="text-gray-500 col-span-3 text-center">No recipes found.</p>
        ) : (
          paginatedRecipes.map((recipe, index) => (
            <div key={index} className="relative">
              <RecipeCard title={recipe.title} image={recipe.image} />
              {isSearching && recipe.score !== null && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-black font-bold px-3 py-1 rounded-lg shadow-md">
                  Score: {recipe.score.toFixed(2)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-4 py-2 border rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
