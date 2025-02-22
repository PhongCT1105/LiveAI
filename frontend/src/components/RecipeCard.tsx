import React from "react";

interface RecipeCardProps {
  title: string;
  image: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, image }) => {
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
      </div>
    </div>
  );
};

export default RecipeCard;
