import { useState } from "react";
import { getStoredIngredients } from "../utils/fridgeHelper";

const Fridge = () => {
  const [ingredients, setIngredients] = useState(getStoredIngredients());

  // Categorizing shelves realistically
  const fridgeSections = {
    "🥬 Top Shelf": ingredients.filter(item => ["Eggs", "Cheese", "Milk"].includes(item)),
    "🍖 Middle Shelf": ingredients.filter(item => ["Chicken", "Fish", "Tofu"].includes(item)),
    "🥕 Bottom Shelf": ingredients.filter(item => ["Carrot", "Lettuce", "Broccoli"].includes(item)),
    "🧃 Door Racks": ingredients.filter(item => ["Juice", "Butter", "Ketchup"].includes(item)),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 pt-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Virtual Fridge</h2>

      {/* Fridge Container */}
      <div className="relative w-96 h-[500px] bg-gray-100 rounded-lg border-8 border-gray-400 shadow-xl flex">
        
        {/* Main Fridge Section */}
        <div className="w-2/3 h-full bg-white rounded-l-lg border-r-4 border-gray-400">
          {Object.entries(fridgeSections).map(([sectionName, items], index) => (
            <div key={index} className="relative flex flex-wrap justify-center items-center w-full h-1/4 border-b border-gray-300 last:border-none bg-gray-300 bg-opacity-30">
              {/* Shelf Label */}
              <div className="absolute left-2 top-1 text-gray-700 text-sm font-semibold">{sectionName}</div>

              {/* Ingredient Icons */}
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <div key={idx} className="m-2 flex flex-col items-center">
                    <span className="text-3xl">{getIngredientIcon(item)}</span>
                    <span className="text-xs text-gray-700">{item}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Empty</span>
              )}
            </div>
          ))}
        </div>

        {/* Door Section */}
        <div className="w-1/3 h-full bg-gray-200 rounded-r-lg relative">
          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-4 h-16 bg-gray-500 rounded-lg"></div> {/* Handle */}
          <div className="flex flex-col h-full justify-evenly p-2">
            {fridgeSections["🧃 Door Racks"].length > 0 ? (
              fridgeSections["🧃 Door Racks"].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center bg-gray-100 rounded-md p-1 shadow">
                  <span className="text-2xl">{getIngredientIcon(item)}</span>
                  <span className="text-xs text-gray-700">{item}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-sm text-center">No Condiments</span>
            )}
          </div>
        </div>
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
