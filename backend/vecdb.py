import os
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import pandas as pd
import numpy as np

load_dotenv()

APIKEY = os.getenv("PINECONE_API_KEY")

pc = Pinecone(api_key=APIKEY)

# Get DB
index_name = "live-ai"

index = pc.Index(index_name)

# Making a query
def get_results(query):

    # Embed the query using the multilingual-e5-large model
    query_embedding = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=[query],
        parameters={"input_type": "query"}
    )

    # Query the index using the embedding
    results = index.query(
        namespace="live-ai-namespace",
        vector=query_embedding[0].values,
        top_k=9,
        include_values=False,
        include_metadata=True
    )
    return results

print(get_results("I want a spicy food"))