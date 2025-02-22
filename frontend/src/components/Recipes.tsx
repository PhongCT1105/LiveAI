import { useState } from "react";
import { findRecipes } from "../utils/recipeHelper";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    const foundRecipes = await findRecipes();
    setRecipes(foundRecipes);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Suggested Recipes</h2>
      <button onClick={fetchRecipes} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
        Find Recipes
      </button>
      <div className="mt-4">
        {recipes.map((recipe, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{recipe.name}</h3>
            <p className="text-gray-600">Ingredients: {recipe.ingredients.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
