import React from "react";
import RecipeInstructions from "./RecipeInstructions";

interface RecipeModalProps {
  recipe: {
    title: string;
    image: string;
    ingredients: string;
    instructions: string;
  } | null;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-30 backdrop-blur-xl transition-opacity duration-300">
      <div className="w-full h-full md:w-3/4 md:h-5/6 bg-white bg-opacity-40 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden relative flex flex-col border border-white/20">
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 bg-white bg-opacity-30 text-gray-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-red-500 hover:text-white transition duration-300"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Content Wrapper */}
        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Image Section */}
          <div className="w-full md:w-1/2 h-60 md:h-full flex items-center justify-center bg-gray-200 bg-opacity-30 rounded-lg">
            <img src={recipe.image} alt={recipe.title} className="max-w-full max-h-full object-contain rounded-lg shadow-md" />
          </div>

          {/* Right: Recipe Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
            <h2 className="text-4xl font-bold text-gray-900 text-center">{recipe.title}</h2>

            {/* Ingredients Section */}
            <h3 className="text-2xl font-semibold text-gray-800 mt-6">🛒 Ingredients</h3>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              {recipe.ingredients.split(",").map((ingredient, index) => (
                <li key={index}>{ingredient.trim()}</li>
              ))}
            </ul>

            {/* Instructions Section */}
            <h3 className="text-2xl font-semibold text-gray-800 mt-6">👩‍🍳 Instructions</h3>
            <RecipeInstructions instructions={recipe.instructions} />

            {/* Action Buttons */}
            <div className="flex justify-center mt-6 space-x-4">
              <button
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                onClick={() => alert(`Using recipe: ${recipe.title}`)}
              >
                🍽 Use This Recipe
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                onClick={() => window.print()}
              >
                🖨 Print Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
