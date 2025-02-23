const API_BASE_URL = "http://127.0.0.1:8000"; // Change to your API endpoint

/**
 * Fetch recipes from FastAPI.
 * @param {string} query - The search term for recipes.
 * @returns {Promise<Array>} - Returns an array of recipes.
 */
export async function fetchRecipes(query: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/recipes?query=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json(); // Parse JSON response
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return []; // Return empty array on error
  }
}
