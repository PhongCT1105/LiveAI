import { useState, useEffect } from "react";
import Papa from "papaparse";
import { motion } from "framer-motion";
import RecipeCard from "./RecipeCard";
import RecipeModal from "./RecipeModal";
import { getStoredIngredients } from "../utils/fridgeHelper";

// Path to assets
const CSV_FILE_PATH = "/src/assets/recipes_with_descriptions.csv";
const IMAGE_PATH = "/src/assets/";

const ITEMS_PER_PAGE = 9;
const API_URL = "http://localhost:8000/recipes";

interface Recipe {
  title: string;
  image: string;
  score: number | null;
  ingredients: string;
  instructions: string;
  availableCount: number;
  totalIngredients: number;
}

interface RecipeCSVRow {
  Title: string;
  Image_Name: string;
  Ingredients: string;
  Instructions: string;
}

interface FetchRecipe {
  title: string;
  image_name: string;
  score: number;
  ingredient: string;
  instructions: string;
}

const Recipes = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const storedIngredients = getStoredIngredients();

  useEffect(() => {
    fetch(CSV_FILE_PATH)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const data = result.data as RecipeCSVRow[];
            const formattedRecipes = data.map((recipe: RecipeCSVRow) => {
              const recipeIngredients = recipe.Ingredients.toLowerCase().split(", ");
              const availableCount = recipeIngredients.filter((ing) =>
                storedIngredients.some((stored) => ing.includes(stored.toLowerCase()))
              ).length;

              return {
                title: recipe.Title,
                image: `${IMAGE_PATH}${recipe.Image_Name}.jpg`,
                score: null,
                ingredients: recipe.Ingredients,
                instructions: recipe.Instructions,
                availableCount,
                totalIngredients: recipeIngredients.length,
              };
            });

            setRecipes(formattedRecipes);
            setFilteredRecipes(formattedRecipes);
          },
        });
      });
  }, []);

  const fetchSimilarRecipes = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setIsSearching(true);
    try {
      const response = await fetch(`${API_URL}?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      const sortedResults = (data as FetchRecipe[]).map((recipe: FetchRecipe) => {
        const recipeIngredients = recipe.ingredient.toLowerCase().split(", ");
        const availableCount = recipeIngredients.filter((ing) =>
          storedIngredients.some((stored) => ing.includes(stored.toLowerCase()))
        ).length;

        return {
          title: recipe.title,
          image: `${IMAGE_PATH}${recipe.image_name}.jpg`,
          score: recipe.score,
          ingredients: recipe.ingredient,
          instructions: recipe.instructions,
          availableCount,
          totalIngredients: recipeIngredients.length,
        };
      }).sort((a, b) => b.score - a.score);

      setFilteredRecipes(sortedResults);
      setCurrentPage(1); // Reset pagination
    } catch (error) {
      console.error("Error fetching similar recipes:", error);
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setFilteredRecipes(recipes);
    setIsSearching(false);
    setCurrentPage(1); // Reset pagination when clearing search
  };

  // Ensure proper pagination
  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.div
      className="min-h-screen w-screen flex flex-col items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-6xl mx-auto pt-20 pb-20 hide-scrollbar">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🍽️ Recipe Explorer</h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search recipes..."
            className="p-3 border rounded-lg w-2/3 md:w-1/2 focus:ring-2 focus:ring-blue-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="ml-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" onClick={fetchSimilarRecipes}>
            Search
          </button>
          <button className="ml-3 p-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition" onClick={handleClear}>
            Clear
          </button>
        </div>

        {loading && <p className="text-center text-gray-500">Loading recipes...</p>}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedRecipes.length === 0 && !loading ? (
            <p className="text-gray-500 col-span-3 text-center">No recipes found.</p>
          ) : (
            paginatedRecipes.map((recipe, index) => (
              <motion.div key={index} className="relative" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <RecipeCard
                  title={`${recipe.title} (${recipe.availableCount}/${recipe.totalIngredients})`}
                  image={recipe.image}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <motion.button
                key={i}
                className={`px-4 py-2 border rounded-md ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                onClick={() => setCurrentPage(i + 1)}
                whileTap={{ scale: 0.9 }}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>
        )}

        {/* Recipe Modal */}
        {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
      </div>
    </motion.div>
  );
};

export default Recipes;
