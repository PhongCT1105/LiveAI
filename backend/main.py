import os
import shutil
from fastapi import FastAPI, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from pinecone import Pinecone
from dotenv import load_dotenv
from typing import List, Dict
from ocr import extract_data, aggregate_item_names
from normalize import extract_ocr_ingredients

# Load environment variables
load_dotenv()

APIKEY = os.getenv("PINECONE_API_KEY")

# Initialize Pinecone
pc = Pinecone(api_key=APIKEY)
index_name = "live-ai"
index = pc.Index(index_name)

# Initialize FastAPI
app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Function to get results from Pinecone
def get_results(query: str):
    query_embedding = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=[query],
        parameters={"input_type": "query"}
    )

    results = index.query(
        namespace="live-ai-namespace",
        vector=query_embedding[0].values,
        top_k=9,
        include_values=False,
        include_metadata=True
    )
    return results

# API Endpoint to fetch recipes based on query
@app.get("/recipes", response_model=List[Dict])
def get_recipes(query: str = Query(..., description="Search query for recipes")):
    results = get_results(query)  # Call Pinecone search function

    filtered_results = [
        {
            "title": match["metadata"]["title"],
            "image_name": match["metadata"]["image_name"],
            "score": match["score"]
        }
        for match in results["matches"]
    ]
    return filtered_results

# API Endpoint to handle file upload and OCR processing
@app.post("/scan")
async def scan_receipt(file: UploadFile = File(...)):
    """
    Endpoint to process uploaded receipt image using OCR and normalize extracted ingredients.
    """
    try:
        file_location = f"uploads/{file.filename}"
        os.makedirs("uploads", exist_ok=True)  # Ensure uploads directory exists

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)  # Save file

        # Extract data using OCR
        receipt_data = extract_data(file_location)
        if not receipt_data:
            return {"error": "Failed to extract receipt data."}

        # Extract and normalize item names
        item_names = aggregate_item_names(receipt_data)
        normalized_ingredients = [extract_ocr_ingredients(item) for item in item_names]

        return {"ingredients": normalized_ingredients}
    
    except Exception as e:
        return {"error": str(e)}
