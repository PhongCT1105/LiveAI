from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

# Sample data for recipes
recipes = [
    {"name": "Spaghetti Carbonara", "ingredients": ["spaghetti", "eggs", "cheese", "bacon"]},
    {"name": "Chicken Curry", "ingredients": ["chicken", "curry powder", "coconut milk", "onions"]},
    {"name": "Beef Tacos", "ingredients": ["beef", "taco shells", "lettuce", "cheese", "salsa"]}
]

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}

@app.get("/recipes", response_model=List[dict])
def get_recipes():
    return recipes