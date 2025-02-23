## virtual envr:
## python -m venv (virtual env name)
## to activate virtual envr: source (virtual env name)/bin/activate
import os 
from google.cloud import documentai
from dotenv import load_dotenv
import re
import json
import pandas as pd
import cv2
import numpy as np

# Load environment variables from .env
load_dotenv()

json_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
project_id = os.getenv("PROJECT_ID")
processor_id = os.getenv("PROCESSOR_ID")
location = os.getenv("LOCATION")  

if not json_path:
    print("Your credential is not in env variable. Check your .env file again!")

if not os.path.exists(json_path):
    print ("JSON Path does not exist")


def preprocess_image(image_path):
    """
    Convert an image to grayscale to enhance OCR performance.
    """
    try:
        # Load image
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Could not load image, check the file path.")

        # Convert to grayscale
        gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Save processed image
        processed_path = "temp_grayscale.jpg"
        cv2.imwrite(processed_path, gray_image)

        return processed_path
    except Exception as e:
        print(f"Error in grayscale conversion: {e}")
        return None                                        

def extract_json_data(response):
    """
    Extracts structured receipt data while correctly associating names with prices.
    """
    extracted_items = []
    total_amount = None
    last_name = ""  # Keep track of the last seen description

    for entity in response.document.entities:
        if entity.type_ == "line_item":
            item_data = {"name": "", "price": None}

            for prop in entity.properties:
                if prop.type_ == "line_item/description":
                    # ✅ Merge multi-line descriptions
                    last_name += " " + prop.mention_text if last_name else prop.mention_text
                elif prop.type_ == "line_item/amount":
                    # ✅ Ensure price is only linked if we have a valid name
                    if re.match(r"^\d+(\.\d{1,2})?$", prop.mention_text):
                        item_data["price"] = float(prop.mention_text)
                        item_data["name"] = last_name.strip()  # Assign last seen name
                        last_name = ""  # Reset for next item

            # ✅ Only add items with both name and price
            if item_data["name"] and item_data["price"] is not None:
                extracted_items.append(item_data)

        elif entity.type_ == "total_amount":
            try:
                total_amount = float(entity.mention_text)
            except ValueError:
                print(f"⚠️ Skipping invalid total_amount: {entity.mention_text}")

    return {"items": extracted_items, "total_amount": total_amount}


def extractData(image_path):

    try:
        processed_image_path = preprocess_image(image_path)

        if not processed_image_path:
            raise ValueError("Image preprocessing failed.")

        # Initialize Document AI client
        client = documentai.DocumentProcessorServiceClient()

        # Read the receipt image
        with open(processed_image_path, "rb") as image_file:
            image_content = image_file.read()

        # Create a request for Document AI
        processor_name = client.processor_path(project_id, location, processor_id)

        request = documentai.ProcessRequest(
            name=processor_name,
            raw_document=documentai.RawDocument(content=image_content, mime_type="image/jpeg"),
        )

        # Process the document
        response = client.process_document(request=request)
        
        # Extract structured data
        receipt_json = extract_json_data(response)

        # Print extracted data in JSON format
        print(json.dumps(receipt_json, indent=4))

        return receipt_json


        
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None  


sample_receipt_path = "/Users/thien/Desktop/CS/Hackathon/Live AI Harvard/LiveAI-1/receipt/test_receipt.jpeg"
receipt_data = extractData(sample_receipt_path)
