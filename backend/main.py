import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pinecone import Pinecone
from dotenv import load_dotenv
from typing import List, Dict

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


