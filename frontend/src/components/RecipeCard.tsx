import React from "react";

interface RecipeCardProps {
  title: string;
  image: string;
  onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, image, onClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
      <img
        src={image}
        alt={title}
        className="w-full h-44 object-cover"
        onError={(e) => (e.currentTarget.src = "/src/assets/default.jpg")} // Fallback image
      />
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition"
          onClick={onClick} // Open modal when clicked
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
