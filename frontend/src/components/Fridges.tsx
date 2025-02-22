import { useState } from "react";
import { getStoredIngredients } from "../utils/fridgeHelper";
import fridgeImage from "../assets/Fridge.png";
import cocaImage from "../assets/coca.png";
import carrotImage from "../assets/carrot.png";



const Fridge = () => {
  const [ingredients, setIngredients] = useState(getStoredIngredients());
  const [isHovered, setIsHovered] = useState(false); // New state for hover effect

  // Categorizing shelves realistically
  const fridgeSections = {
    "🥬 Top Shelf": ingredients.filter(item => ["Eggs", "Cheese", "Milk"].includes(item)),
    "🍖 Middle Shelf": ingredients.filter(item => ["Chicken", "Fish", "Tofu"].includes(item)),
    "🥕 Bottom Shelf": ingredients.filter(item => ["Carrot", "Lettuce", "Broccoli"].includes(item)),
    "🧃 Door Racks": ingredients.filter(item => ["Juice", "Butter", "Ketchup"].includes(item)),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white-200 pt-16">
      {/* <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Virtual Fridge</h2> */}

      {/* Fridge Container */}
      <div className="relative w-[450px] h-[600px]">
        <img src={fridgeImage} alt="Fridge" className="w-full h-full object-cover" />

        {/* Coca icon inside the fridge */}
        <img
          src={cocaImage}
          alt="cocaIcon"
          className="absolute top-[55%] left-[22%] transform -translate-x-1/2 -translate-y-1/2 w-[55px] h-[55px]"
        />
        {/* Carrot icon inside the fridge */}
        <img
          src={carrotImage}
          alt="carrotIcon"
          className={`absolute top-[55%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[70px] transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </div>

    </div>
  );
};

// Function to return corresponding ingredient icons
const getIngredientIcon = (item) => {
  const icons = {
    "Milk": "🥛",
    "Cheese": "🧀",
    "Yogurt": "🍦",
    "Apple": "🍎",
    "Banana": "🍌",
    "Orange": "🍊",
    "Carrot": "🥕",
    "Broccoli": "🥦",
    "Lettuce": "🥬",
    "Eggs": "🥚",
    "Chicken": "🍗",
    "Fish": "🐟",
    "Tofu": "🫛",
    "Juice": "🧃",
    "Butter": "🧈",
    "Ketchup": "🍅",
  };
  return icons[item] || "❓";
};

export default Fridge;
