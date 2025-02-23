import { useState, useEffect } from "react";
import { getIngredientQuantities, getStoredIngredients } from "../utils/fridgeHelper";
import fridgeImage from "../assets/fridge_empty.png";
import axios from "axios";

const Fridge = () => {
  const [ingredients, setIngredients] = useState(getStoredIngredients());
  const [quantities, setQuantities] = useState(getIngredientQuantities());
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  // useEffect(() => {
  //   // Fetch data from the backend
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("/api/ingredients"); // Replace with your API endpoint
  //       setIngredients(response.data.ingredients);
  //       setQuantities(response.data.quantities);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const positioningConfig = {
    "🍏 Top Shelf": { top: "16%", left: "50%", width: "80%", items: ["Apple", "Banana", "Cake"] },
    "🥚 Second Shelf": { top: "29%", left: "50%", width: "80%", items: ["Eggs", "Cheese", "Milk", "Yogurt"] },
    "🍖 Third Shelf": { top: "40%", left: "50%", width: "80%", items: ["Chicken", "Fish", "Tofu"] },
    "🥕 Bottom Shelf": { top: "53%", left: "50%", width: "80%", items: ["Carrot", "Lettuce", "Broccoli"] },
    "🧃 Door Racks": { top: "20%", left: "85%", width: "15%", items: ["Juice", "Butter", "Ketchup"] },
    "Freezer": { top: "75%", left: "50%", width: "80%", items: ["Frozen", "Frozen", "Frozen", "Frozen"] }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-200 pt-16">
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

      <div className="relative w-[800px] h-[526px] rounded-lg">
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
    Fish: "🐟",
    Tofu: "🫛",
    Juice: "🧃",
    Butter: "🧈",
    Ketchup: "🍅",
    Cake: "🍰",
    Frozen: "🥶",
  };
  return icons[item] || "❓";
};

export default Fridge;
