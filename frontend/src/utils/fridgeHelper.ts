// ingredients.ts

export const getStoredIngredients = (): string[] => {
  return Object.keys(getIngredientQuantities()); // Get ingredient names
};

// Retrieve ingredient quantities from localStorage or default values
export const getIngredientQuantities = (): Record<string, number> => {
  const storedData = localStorage.getItem("ingredientQuantities");
  if (storedData) {
    return JSON.parse(storedData);
  }
  return {
    Milk: 1,
    Cheese: 1,
    Yogurt: 1,
    Apple: 3,
    Banana: 2,
    Orange: 4,
    Carrot: 2,
    Broccoli: 1,
    Lettuce: 1,
    Eggs: 6,
    Chicken: 1,
    Fish: 1,
    Tofu: 1,
    Juice: 1,
    Butter: 1,
    Ketchup: 1,
    Cake: 1,
    Frozen: 3,
  };
};

// Reduce ingredient quantity by 1
export const useIngredients = (usedIngredients: string[]) => {
  const quantities = getIngredientQuantities();

  usedIngredients.forEach((ingredient) => {
    const formattedIngredient = ingredient.trim().toLowerCase();

    // Find matching ingredient in stored list
    const foundIngredient = Object.keys(quantities).find(
      (stored) => stored.toLowerCase() === formattedIngredient
    );

    if (foundIngredient) {
      // Reduce by 1, remove if 0
      quantities[foundIngredient] = Math.max(0, quantities[foundIngredient] - 1);
      if (quantities[foundIngredient] === 0) {
        delete quantities[foundIngredient];
      }
    }
  });

  localStorage.setItem("ingredientQuantities", JSON.stringify(quantities)); // Save updated data
};
