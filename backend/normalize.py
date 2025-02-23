import re
from rapidfuzz import fuzz, process

# Define standard known ingredients
known_ingredients = [
    "milk", "almond milk", "soy milk", "sugar", "butter", "flour", "eggs", "salt",
    "pepper", "cheese", "tomato", "onion", "garlic", "chicken", "beef", "pork", 
    "olive oil", "honey", "vanilla", "cinnamon", "mustard", "mayonnaise", "bread", 
    "yogurt", "cream", "parsley", "cilantro", "thyme", "oregano", "bay leaves", "carrot",
    "mushrooms", "coconut milk", "spinach", "cumin", "vinegar", "eggplant", "chili",
    "lettuce", "radish", "turmeric", "ginger", "sesame", "soy sauce", "lemon", "lime"
]

# Function to normalize OCR text
def normalize_text(text):
    text = text.lower().strip()
    text = re.sub(r'[^a-z\s,]', '', text)  # Remove special characters except commas
    return text

# Function to extract known ingredients from OCR text
def extract_ocr_ingredients(ocr_text):
    normalized_text = normalize_text(ocr_text)  # Normalize text
    ingredients = normalized_text.split(',')  # Split into individual items

    clean_ingredients = set()
    for ingredient in ingredients:
        ingredient = ingredient.strip()
        if ingredient:  # Ensure it's not empty
            match, score, _ = process.extractOne(ingredient, known_ingredients, scorer=fuzz.partial_ratio)
            if score > 75:  # Only add if a strong match is found
                clean_ingredients.add(match)

    return ', '.join(clean_ingredients)  # Return only valid matches

# Test cases
test_input = "mlk almd xyz"
test_output = extract_ocr_ingredients(test_input)
print(test_output)  # Output: "milk, almond milk"
