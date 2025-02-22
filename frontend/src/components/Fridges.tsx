import { useState } from "react";
import { getStoredIngredients } from "../utils/fridgeHelper";

const Fridge = () => {
  const [ingredients, setIngredients] = useState(getStoredIngredients());

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Your Virtual Fridge</h2>
      <ul className="mt-4">
        {ingredients.map((item, index) => (
          <li key={index} className="bg-gray-100 p-2 m-2 rounded">{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Fridge;
