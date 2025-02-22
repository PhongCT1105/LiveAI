import { useState, useEffect } from "react";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");

  const fetchRecipes = async (query: string) => {
    const response = await fetch(`http://localhost:8000/recipes`);
    const data = await response.json();
    setRecipes(data);
  };

  const handleSearch = () => {
    fetchRecipes(query);
  };

  useEffect(() => {
    fetchRecipes("");
  }, []);

  return (
    <div className="p-8 px">
      <h2 className="text-3xl font-bold mb-4">Suggested Recipes</h2>
      <div className="flex mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded-l-lg flex-grow"
          placeholder="Search for recipes..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg bg-white">
            <img
              src={`https://via.placeholder.com/150?text=${recipe.name}`}
              alt={recipe.name}
              className="w-full h-32 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
              <p className="text-gray-600 mb-2">Ingredients: {recipe.ingredients.join(", ")}</p>
              <p className="text-gray-600">Preparation Time: 30 minutes</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;