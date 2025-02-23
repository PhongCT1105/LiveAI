import React from "react";
import { useNavigate } from "react-router-dom"; // ONLY import this in the modal

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

  const navigate = useNavigate(); // useNavigate is only used here in the modal

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleUseRecipe = () => {
    onClose();
    alert(`Using recipe: ${recipe.title}`);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto relative transform transition-all duration-300"
        onClick={handleModalClick}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">{recipe.title}</h2>
        <img src={recipe.image} alt={recipe.title} className="w-full h-44 object-cover rounded-md mb-4" />

        <h3 className="text-lg font-semibold text-gray-700">Ingredients:</h3>
        <p className="text-gray-600 mb-2">{recipe.ingredients}</p>

        <h3 className="text-lg font-semibold text-gray-700">Instructions:</h3>
        <p className="text-gray-600 mb-4">{recipe.instructions}</p>

        {/* Use Recipe Button */}
        <button
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200"
          onClick={handleUseRecipe}
        >
          Use This Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeModal;
