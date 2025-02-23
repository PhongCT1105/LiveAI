import os 
from google.cloud import documentai
from dotenv import load_dotenv
import re
import json
import cv2

# Load environment variables from .env
load_dotenv()

json_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
project_id = os.getenv("PROJECT_ID")
processor_id = os.getenv("PROCESSOR_ID")
location = os.getenv("LOCATION")  

def preprocess_image(image_path):
    """
    Convert an image to grayscale to enhance OCR performance.
    """
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Could not load image, check the file path.")
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    except Exception as e:
        print(f"Error in grayscale conversion: {e}")
        return None

def extract_json_data(response):
    """
    Extracts structured receipt data while correctly associating names with prices.
    """
    extracted_items = []
    total_amount = None
    last_name = ""

    for entity in response.document.entities:
        if entity.type_ == "line_item":
            item_data = {"name": "", "price": None}
            for prop in entity.properties:
                if prop.type_ == "line_item/description":
                    last_name += " " + prop.mention_text if last_name else prop.mention_text
                elif prop.type_ == "line_item/amount":
                    if re.match(r"^\d+(\.\d{1,2})?$", prop.mention_text):
                        item_data["price"] = float(prop.mention_text)
                        item_data["name"] = last_name.strip()
                        last_name = ""
            if item_data["name"] and item_data["price"] is not None:
                extracted_items.append(item_data)
        elif entity.type_ == "total_amount":
            try:
                total_amount = float(entity.mention_text)
            except ValueError:
                print(f"Skipping invalid total_amount: {entity.mention_text}")

    return {"items": extracted_items, "total_amount": total_amount}

def extract_data(image_path):
    try:
        preprocess_image(image_path)        
        client = documentai.DocumentProcessorServiceClient()
        with open(image_path, "rb") as image_file:
            image_content = image_file.read()
        
        processor_name = client.processor_path(project_id, location, processor_id)
        request = documentai.ProcessRequest(
            name=processor_name,
            raw_document=documentai.RawDocument(content=image_content, mime_type="image/jpeg"),
        )
        response = client.process_document(request=request)
        receipt_json = extract_json_data(response)
        
        print(json.dumps(receipt_json, indent=4))
        return receipt_json
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None  

def aggregate_item_names(receipt_data):
    """
    Extracts item names into an array.
    """
    return [item["name"] for item in receipt_data.get("items", [])]

# Example usage
sample_receipt_path = "../receipt/grocery-test.png"
receipt_data = extract_data(sample_receipt_path)
if receipt_data:
    item_names = aggregate_item_names(receipt_data)
    print("Extracted item names:", item_names)
