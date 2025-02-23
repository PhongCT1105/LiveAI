export const getStoredIngredients = () => {
  return [
    "Apple", "Banana", "Orange",  // Fruits
    "Eggs", "Milk", "Cheese", "Yogurt", "Butter",  // Milk Products
    "Chicken", "Beef", "Pork", "Fish", "Tofu",  // Protein
    "Carrot", "Broccoli", "Lettuce", "Potato", "Spinach",  // Vegetables
    "Garlic", "Onion", "Parsley", "Cilantro",  // Herbs
    "Salt", "Pepper", "Soy sauce", "Ketchup", "Mustard", "Mayonnaise", "Vinegar",  // Condiments
    "Juice", "Cake", "Bread",  // Other
    "Frozen Meat", "Frozen Vegetables"  // Freezer Items
  ];
};

export const getIngredientQuantities = () => {
  return {
    // Fruits
    "Apple": "3 pcs",
    "Banana": "2 pcs",
    "Orange": "4 pcs",

    // Milk Products
    "Milk": "1L",
    "Cheese": "200g",
    "Yogurt": "1 cup",
    "Butter": "100g",

    // Protein
    "Eggs": "6 pcs",
    "Chicken": "500g",
    "Beef": "400g",
    "Pork": "350g",
    "Fish": "300g",
    "Tofu": "250g",

    // Vegetables
    "Carrot": "2 pcs",
    "Broccoli": "1 head",
    "Lettuce": "1 bunch",
    "Potato": "3 pcs",
    "Spinach": "1 bunch",

    // Herbs
    "Garlic": "5 cloves",
    "Onion": "2 bulbs",
    "Parsley": "1 bunch",
    "Cilantro": "1 bunch",

    // Condiments
    "Salt": "1 tsp",
    "Pepper": "1 tsp",
    "Soy sauce": "500ml",
    "Ketchup": "500ml",
    "Mustard": "300ml",
    "Mayonnaise": "400ml",
    "Vinegar": "250ml",

    // Other
    "Juice": "1L",
    "Cake": "1 slice",
    "Bread": "1 loaf",

    // Freezer Items
    "Frozen Meat": "3 packets",
    "Frozen Vegetables": "2 packets"
  };
};
