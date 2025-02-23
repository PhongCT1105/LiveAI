import React from "react";
import { motion } from "framer-motion";

interface RecipeCardProps {
  title: string;
  image: string;
  onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, image, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg"
    >
      {/* Image Section */}
      <img
        src={image}
        alt={title}
        className="w-full h-44 object-cover"
        onError={(e) => (e.currentTarget.src = "/src/assets/default.jpg")} // Fallback image
      />

      {/* Content Section */}
      <div className="p-4 flex flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-gray-900 h-20 overflow-hidden text-ellipsis line-clamp-2">
          {title}
        </h2>
        <button
          className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition"
          onClick={onClick}
        >
          View Recipe
        </button>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
