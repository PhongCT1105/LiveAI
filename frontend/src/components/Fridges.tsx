import { useState } from "react";
import { getIngredientQuantities, getStoredIngredients } from "../utils/fridgeHelper";
import fridgeImage from "../assets/fridge_empty.png";

const Fridge = () => {
  const [ingredients, setIngredients] = useState(getStoredIngredients());
  const [quantities, setQuantities] = useState(getIngredientQuantities());
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  const handleAddIngredient = () => {
    if (newIngredient && newQuantity) {
      if (!ingredients.includes(newIngredient)) {
        setIngredients([...ingredients, newIngredient]);
      }

      const extractNumber = (str) => {
        const match = str.match(/\d+/);
        return match ? Number(match[0]) : 0;
      };

      const newQuantNum = extractNumber(newQuantity);
      const existingQuantNum = extractNumber(quantities[newIngredient] ?? "0");

      const totalQuantity = newQuantNum + existingQuantNum;

      const unitMatch = newQuantity.match(/[a-zA-Z]+/);
      const unit = unitMatch ? unitMatch[0] : "";

      setQuantities({
        ...quantities,
        [newIngredient]: `${totalQuantity}${unit}`,
      });

      setNewIngredient("");
      setNewQuantity("");
      setShowAddForm(false);
    }
  };

  const positioningConfig = {
    "🍏 Top Shelf": { top: "16%", left: "50%", width: "80%", items: ["Apple", "Banana", "Cake"] },
    "🥚 Second Shelf": { top: "29%", left: "50%", width: "80%", items: ["Eggs", "Cheese", "Milk", "Yogurt"] },
    "🍖 Third Shelf": { top: "40%", left: "50%", width: "80%", items: ["Chicken", "Fish", "Tofu", "Meat"] },
    "🥕 Bottom Shelf": { top: "53%", left: "50%", width: "80%", items: ["Carrot", "Lettuce", "Broccoli", "Potato"] },
    "🧃 Door Racks": { top: "20%", left: "85%", width: "15%", items: ["Juice", "Butter", "Ketchup"] },
    "Freezer": { top: "75%", left: "50%", width: "80%", items: ["Frozen", "Frozen", "Frozen", "Frozen"] }
  };

  // Calculate fridge translation based on pop-up visibility
  const fridgeTranslation = () => {
    if (selectedIngredient || showAddForm) {
      return "translate-x-32"; // Move fridge to the right if one pop-up is visible
    } else {
      return "translate-x-0"; // No translation if no pop-ups are visible
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-200 pt-16">
      {/* Quantity Pop-up */}
      {selectedIngredient && (
        <div className="absolute left-5 top-20 w-75 h-40 bg-white shadow-lg rounded-lg p-4 transition-transform duration-300 transform translate-x-0">
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

      {/* Add Ingredient Pop-up */}
      {showAddForm && (
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 w-75 h-70 bg-white shadow-lg rounded-lg p-4 transition-transform duration-300">
          <h3 className="text-lg font-bold mb-4">Add New Ingredient</h3>
          <input
            type="text"
            placeholder="Ingredient Name"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="text"
            placeholder="Quantity"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            onClick={handleAddIngredient}
          >
            Add
          </button>
          <button
            className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <h2 className={`text-3xl font-bold text-gray-800 mb-6 transition-transform duration-300 ${fridgeTranslation()}`}>Your Virtual Fridge</h2>

      <button
        className={`mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition transition-transform duration-300 ${fridgeTranslation()}`}
        onClick={() => setShowAddForm(true)}
      >
        Add Ingredient
      </button>

      {/* Fridge Container */}
      <div className={`relative w-[800px] h-[526px] rounded-lg transition-transform duration-300 ${fridgeTranslation()}`}>
        <img src={fridgeImage} alt="Fridge" className="w-full h-[400px] object-fill rounded-lg" />

        {Object.entries(positioningConfig).map(([sectionName, config], index) => {
          const itemsInSection = ingredients.filter((item) => config.items.includes(item));
          const isOdd = itemsInSection.length % 2 !== 0;

          return (
            <div
              key={index}
              className={`absolute flex flex-wrap justify-center items-center ${isOdd ? "-translate-x-12" : ""}`}
              style={{
                top: config.top,
                left: config.left,
                width: config.width,
                transform: "translate(-50%, -29%)",
              }}
            >
              {itemsInSection.map((item, idx) => (
                <div
                  key={idx}
                  className={`m-2 flex flex-col items-center cursor-pointer group transition-transform duration-300 hover:scale-110`}
                  onClick={() => setSelectedIngredient(item)}
                >
                  <div className="text-[40px] w-[80px] h-[80px] flex items-center justify-center transition-transform group-hover:animate-shake">
                    {getIngredientIcon(item)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* CSS Animation for Shaking */}
      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            50% { transform: translateX(4px); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
          }

          .animate-shake {
            animation: shake 0.2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

const getIngredientIcon = (item) => {
  const icons = {
    Milk: "🥛",
    Cheese: "🧀",
    Yogurt: "🍦",
    Apple: "🍎",
    Banana: "🍌",
    Orange: "🍊",
    Carrot: "🥕",
    Broccoli: "🥦",
    Lettuce: "🥬",
    Eggs: "🥚",
    Chicken: "🍗",
    Meat: "🥩",
    Fish: "🐟",
    Tofu: "🫛",
    Juice: "🧃",
    Butter: "🧈",
    Ketchup: "🍅",
    Cake: "🍰",
    Frozen: "🥶",
    Potato: "🥔"
  };
  return icons[item] || "❓";
};

export default Fridge;