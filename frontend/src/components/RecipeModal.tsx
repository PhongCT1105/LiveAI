import React from "react";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{recipe.title}</h2>
        <img src={recipe.image} alt={recipe.title} className="w-full h-44 object-cover rounded-md mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">Ingredients:</h3>
        <p className="text-gray-600 mb-2">{recipe.ingredients}</p>
        <h3 className="text-lg font-semibold text-gray-700">Instructions:</h3>
        <p className="text-gray-600 mb-4">{recipe.instructions}</p>
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default RecipeModal;
