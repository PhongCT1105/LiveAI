// Fridge.tsx
import { useState, useRef, useEffect } from "react";
import { getIngredientQuantities, saveIngredientQuantities } from "../utils/fridgeHelper";
import fridgeImage from "../assets/fridge_empty.png";
import axios from "axios";

interface FridgeProps {
  scannedIngredients: string[];
}

const Fridge = ({ scannedIngredients }: FridgeProps) => {
  const [ingredients, setIngredients] = useState<string[]>([
    "Fruits", "Milk Products", "Meat", "Vegetables", "Condiments", "Frozen Meat", "Frozen Vegetables",
    "Cake", "Bread", "Cheese", "Eggs", "Butter", "Herbs", "Juice", "Ketchup", "Soy sauce",
    "Mustard", "Mayonnaise", "Fish", "Tofu", "Garlic", "Onion", "Parsley", "Cilantro"
  ]);
  const [quantities, setQuantities] = useState<Record<string, string>>(() => {
    const quantities = getIngredientQuantities();
    const stringQuantities: Record<string, string> = {};
    for (const key in quantities) {
      stringQuantities[key] = quantities[key].toString();
    }
    return stringQuantities;
  });
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [showQuantityPopup, setShowQuantityPopup] = useState(false);
  const [scannedIngredientsWithQuantities, setScannedIngredientsWithQuantities] = useState<
    Record<string, { quantity: string; group: string }>
  >({});

  const [ingredientGroups, setIngredientGroups] = useState<Record<string, string[]>>({
    "Meat": ["Beef", "Pork", "Chicken", "Fish"],
    "Milk Products": ["Milk", "Yogurt", "Cream"],
    "Vegetables": ["Carrot", "Lettuce", "Broccoli", "Potato", "Spinach"],
    "Condiments": ["Salt", "Pepper", "Mustard", "Mayonnaise", "Soy sauce"],
    "Fruits": ["Apple", "Banana", "Orange"],
    "Herbs": ["Garlic", "Onion", "Parsley", "Cilantro",]
  });

  const quantityCardRef = useRef<HTMLDivElement>(null);
  const [quantityCardHeight, setQuantityCardHeight] = useState(0);

  useEffect(() => {
    if (quantityCardRef.current) {
      setQuantityCardHeight(quantityCardRef.current.offsetHeight);
    }
  }, [selectedIngredient]);

  // Show the quantity pop-up when scannedIngredients is updated
  useEffect(() => {
    if (scannedIngredients.length > 0) {
      setShowQuantityPopup(true);
    }
  }, [scannedIngredients]);

  const handleAddIngredient = () => {
    if (newIngredient && newQuantity && newGroup) {
      if (!ingredients.includes(newIngredient)) {
        setIngredients([...ingredients, newIngredient]);
      }

      const extractNumber = (str: string): number => {
        const match = str.match(/\d+/);
        return match ? Number(match[0]) : 0;
      };

      const newQuantNum = extractNumber(newQuantity);
      const existingQuantNum = extractNumber(quantities[newIngredient] ?? "0");

      const totalQuantity = newQuantNum + existingQuantNum;

      const unitMatch = newQuantity.match(/[a-zA-Z]+/);
      const unit = unitMatch ? unitMatch[0] : "";

      const updatedQuantities = {
        ...quantities,
        [newIngredient]: `${totalQuantity} ${unit}`,
      };

      setQuantities(updatedQuantities);
      saveIngredientQuantities(updatedQuantities); // Save to localStorage

      setIngredientGroups((prevGroups) => ({
        ...prevGroups,
        [newGroup]: [...(prevGroups[newGroup] || []), newIngredient],
      }));

      setNewIngredient("");
      setNewQuantity("");
      setNewGroup("");
      setShowAddForm(false);
    }
  };

  const handleIngredientClick = (ingredient: string) => {
    const groupName = Object.keys(ingredientGroups).find(group =>
      ingredientGroups[group].includes(ingredient)
    );

    if (groupName) {
      setSelectedIngredient(groupName);
    } else {
      setSelectedIngredient(ingredient);
    }
  };

  const handleQuantityInput = (ingredient: string, quantity: string, group: string) => {
    setScannedIngredientsWithQuantities((prev) => ({
      ...prev,
      [ingredient]: { quantity, group },
    }));
  };

  const handleSaveQuantities = () => {
    const newQuantities = { ...quantities };
    const newIngredientGroups = { ...ingredientGroups };

    Object.entries(scannedIngredientsWithQuantities).forEach(([ingredient, data]) => {
      const { quantity, group } = data;

      // Update quantities
      newQuantities[ingredient] = quantity;

      // Update ingredient groups
      if (group && group !== "new") {
        if (!newIngredientGroups[group].includes(ingredient)) {
          newIngredientGroups[group] = [...newIngredientGroups[group], ingredient];
        }
      }
    });

    setQuantities(newQuantities);
    setIngredientGroups(newIngredientGroups);
    saveIngredientQuantities(newQuantities); // Save to localStorage
    setShowQuantityPopup(false);
    setScannedIngredientsWithQuantities({});
  };

  const positioningConfig = {
    "Top Shelf": { top: "16%", left: "50%", width: "80%", items: ["Fruits", "Cake", "Juice", "Condiments"] },
    "Second Shelf": { top: "29%", left: "50%", width: "80%", items: ["Milk Products", "Eggs", "Butter", "Cheese"] },
    "Third Shelf": { top: "40%", left: "50%", width: "80%", items: ["Meat", "Fish", "Tofu"] },
    "Bottom Shelf": { top: "53%", left: "50%", width: "80%", items: ["Vegetables", "Herbs"] },
    "Freezer": { top: "75%", left: "50%", width: "80%", items: ["Frozen Meat", "Frozen Vegetables"] }
  };

  const fridgeTranslation = () => {
    if (selectedIngredient || showAddForm) {
      return "translate-x-32";
    } else {
      return "translate-x-0";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-200 pt-16">
      {selectedIngredient && (
        <div
          ref={quantityCardRef}
          className="absolute left-5 top-20 w-75 h-auto bg-white shadow-lg rounded-lg p-4 transition-transform duration-300"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        >
          <h3 className="text-lg font-bold">{selectedIngredient}</h3>

          {ingredientGroups[selectedIngredient] ? (
            <ul>
              {ingredientGroups[selectedIngredient].map((item) => (
                <li key={item} className="text-gray-700 mt-1">
                  {item}: {quantities[item] || "Unknown"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 mt-2">Quantity: {quantities[selectedIngredient] || "Unknown"}</p>
          )}

          <button
            className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={() => setSelectedIngredient(null)}
          >
            Close
          </button>
        </div>
      )}

      {showAddForm && (
        <div
          className="absolute left-5 w-75 h-90 bg-white shadow-lg rounded-lg p-4 transition-transform duration-300"
          style={{
            top: selectedIngredient ? `calc(100px + ${quantityCardHeight}px + 16px)` : "50%",
            transform: selectedIngredient ? "translateY(0)" : "translateY(-50%)",
          }}
        >
          <h3 className="text-lg font-bold mb-4">Add New Ingredient</h3>
          <select
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Select Group</option>
            {Object.keys(ingredientGroups).map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
            <option value="new">Create New Group</option>
          </select>
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
          {newGroup === "new" && (
            <input
              type="text"
              placeholder="New Group Name"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          )}
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

      {/* Quantity Pop-up for Scanned Ingredients */}
      {showQuantityPopup && (
        <div className="z-99 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Enter Quantities and Group for Scanned Ingredients</h3>
            {scannedIngredients.map((ingredient) => (
              <div key={ingredient} className="mb-4">
                <label className="block text-gray-700">{ingredient}</label>
                <input
                  type="text"
                  placeholder="Quantity"
                  value={scannedIngredientsWithQuantities[ingredient]?.quantity || ""}
                  onChange={(e) =>
                    handleQuantityInput(ingredient, e.target.value, scannedIngredientsWithQuantities[ingredient]?.group || "")
                  }
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <select
                  value={scannedIngredientsWithQuantities[ingredient]?.group || ""}
                  onChange={(e) =>
                    handleQuantityInput(ingredient, scannedIngredientsWithQuantities[ingredient]?.quantity || "", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Group</option>
                  {Object.keys(ingredientGroups).map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                  <option value="new">Create New Group</option>
                </select>
              </div>
            ))}
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              onClick={handleSaveQuantities}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <h2 className={`text-3xl font-bold text-gray-800 mb-6 transition-transform duration-300 ${fridgeTranslation()}`}>Your Virtual Fridge</h2>

      <button
        className={`mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition transition-transform duration-300 ${fridgeTranslation()}`}
        onClick={() => setShowAddForm(true)}
      >
        Add Ingredient
      </button>

      <div className={`relative w-[800px] h-[526px] rounded-lg transition-transform duration-300 ${fridgeTranslation()}`}>
        <img src={fridgeImage} alt="Fridge" className="w-full h-[400px] object-fill rounded-lg" />

        {Object.entries(positioningConfig).map(([_sectionName, config], index) => {
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

const getIngredientIcon = (item: string): string => {
  const icons: Record<string, string> = {
    "Meat": "🥩",
    "Fish": "🐟",
    "Milk Products": "🥛",
    "Vegetables": "🥬",
    "Condiments": "🧂",
    "Fruits": "🍎",
    "Frozen Meat": "❄️",
    "Frozen Vegetables": "🥦",
    "Cake": "🍰",
    "Bread": "🍞",
    "Cheese": "🧀",
    "Eggs": "🥚",
    "Butter": "🧈",
    "Herbs": "🌿",
    "Juice": "🧃",
    "Ketchup": "🍅",
    "Soy sauce": "🥢",
    "Mustard": "🌭",
    "Mayonnaise": "🥪",
    "Tofu": "🫛"
  };

  return icons[item] || "❓";
};

export default Fridge;