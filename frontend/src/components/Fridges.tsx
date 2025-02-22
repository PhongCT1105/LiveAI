import { useState } from "react";
import { getIngredientQuantities, getStoredIngredients } from "../utils/fridgeHelper";
import { getStoredIngredients } from "../utils/fridgeHelper";
import fridgeImage from "../assets/Fridge.png";
import cocaImage from "../assets/coca.png";
import carrotImage from "../assets/carrot.png";



const Fridge = () => {
  const [ingredients, setIngredients] = useState(getStoredIngredients());
  const [quantities, setQuantities] = useState(getIngredientQuantities());
  const [isHovered, setIsHovered] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  // Categorizing shelves realistically
  const fridgeSections = {
    "🍏 Top Shelf": ingredients.filter(item => ["Apple", "Banana", "Cake"].includes(item)),
    "🥚 Second Shelf": ingredients.filter(item => ["Eggs", "Cheese", "Milk"].includes(item)),
    "🍖 Third Shelf": ingredients.filter(item => ["Chicken", "Fish", "Tofu"].includes(item)),
    "🥕 Bottom Shelf": ingredients.filter(item => ["Carrot", "Lettuce", "Broccoli"].includes(item)),
    "🧃 Door Racks": ingredients.filter(item => ["Juice", "Butter", "Ketchup"].includes(item)),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-200 pt-16">
      {/* Left Panel - Ingredient Details */}
      {selectedIngredient && (
        <div className="absolute left-5 top-20 w-64 h-40 bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-lg font-bold">{selectedIngredient}</h3>
          <p className="text-gray-700 mt-2">Quantity: {quantities[selectedIngredient] || "Unknown"}</p>
          <button
            className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={() => setSelectedIngredient(null)}
          >
            Close
          </button>
        </div>
      )}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Virtual Fridge</h2>

      {/* Fridge Container */}
      <div className="relative w-96 h-[600px] bg-gray-100 rounded-lg shadow-xl flex">

        {/* Main Fridge Section */}
        <div className="w-2/3 h-full bg-white rounded-l-lg">
          {Object.entries(fridgeSections).map(([sectionName, items], index) => (
            <div key={index} className="relative flex flex-wrap justify-center items-center w-full h-1/5 last:border-none bg-gray-300 bg-opacity-30">
              {/* Shelf Label */}
              <div className="absolute left-2 top-1 text-gray-700 text-sm font-semibold">{sectionName}</div>

              {/* Ingredient Icons */}
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <div key={idx}
                    className={`m-2 flex flex-col items-center transition-transform duration-300 ${isHovered == item ? 'scale-110' : ''}`}
                    onMouseEnter={() => setIsHovered(item)}
                    onMouseLeave={() => setIsHovered(null)}
                    onClick={() => setSelectedIngredient(item)}>
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
    "Cake": "🍰"
  };
  return icons[item] || "❓";
};

export default Fridge;
